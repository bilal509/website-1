package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"main/config"
	"net/http"
	"os"
	"path/filepath"
	"regexp"

	"github.com/go-chi/chi/middleware"

	"github.com/go-chi/chi"
)

var routeGroupRegex = regexp.MustCompile(":([a-zA-Z]*)")

func main() {
	// Load configuration
	if err := config.Initialize(); err != nil {
		panic(fmt.Sprintf("Unable to load configuration: %s", err))
	}

	// Read routes file
	routesFile, err := ioutil.ReadFile(config.Get().RoutesConfigFilePath)
	if err != nil {
		panic(fmt.Sprintf("Unable to read routes file: %s", err))
	}

	// Parse routes file
	routes := map[string]string{}
	if err := json.Unmarshal(routesFile, &routes); err != nil {
		panic(fmt.Sprintf("Unable to parse routes file: %s", err))
	}

	// Create router and add redirectOriginMiddleware middleware, notFoundHandler
	router := chi.NewMux()
	if config.Get().RedirectOrigin {
		router.Use(redirectOriginMiddleware)

	}
	router.Use(middleware.DefaultCompress)
	router.NotFound(notFoundHandler(config.Get().Domain, config.Get().ErrorURL))

	// Register routes
	for _, route := range routes {
		router.HandleFunc(routeGroupRegex.ReplaceAllString(route, "{$1}"), indexHandler)
	}

	// Register static files
	if err := registerStaticFiles(router, config.Get().PublicFilePath); err != nil {
		panic(fmt.Sprintf("Unable register static files: %s", err))
	}

	// Start the server
	if err := http.ListenAndServe(fmt.Sprintf(":%d", config.Get().Port), router); err != nil {
		panic(fmt.Sprintf("Unable to start server: %s", err))
	}
}

// indexHandler serves the index html file.
func indexHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, config.Get().IndexFilePath)
}

// newStaticFileHandler creates a new static file handler which serves a single file.
func newStaticFileHandler(path string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, path)
	})
}

// registerStaticFiles registers all static files that are contained inside the given basePath
func registerStaticFiles(router chi.Router, basePath string) error {
	return filepath.Walk(basePath, func(path string, info os.FileInfo, err error) error {
		if info.IsDir() || err != nil {
			return err
		}

		route, err := filepath.Rel(basePath, path)
		if err != nil {
			return err
		}

		router.Handle("/"+route, newStaticFileHandler(path))
		return nil
	})
}

// notFoundHandler redirects to the not error url and sets the error cookie to not found
func notFoundHandler(cookieDomain, errorURL string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.SetCookie(w, &http.Cookie{
			Domain: cookieDomain,
			Secure: true,
			Value:  "error=404",
			Name:   "error",
		})

		http.Redirect(w, r, errorURL, http.StatusTemporaryRedirect)
	}
}

// redirectOriginMiddleware is the middleware used to check the request origin and redirect if necessary
func redirectOriginMiddleware(handler http.Handler) http.Handler {
	host := config.Get().Domain

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Host != host {
			http.Redirect(w, r, "https://"+host, http.StatusTemporaryRedirect)
			return
		}

		handler.ServeHTTP(w, r)
	})
}
