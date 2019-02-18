package config

import (
	"github.com/kelseyhightower/envconfig"
)

var config *Config

// Config represents the application configuration.
type Config struct {
	// IndexFilePath is the file path to the index HTML file.
	// (This should not contain ../../ etc. since it will be rejected by http.ServeFile)
	IndexFilePath string `default:"./public/index.html" envconfig:"index_file_path"`

	// PublicFilePath is the folder path to the public folder.
	PublicFilePath string `default:"./public" envconfig:"public_file_path"`

	// RoutesConfigFilePath is the file path to the routes config file.
	RoutesConfigFilePath string `default:"./paths.config.json" envconfig:"routes_config_file_path"`

	// Domain is the domain the backend is running on.
	Domain string `default:"hyperprivacy.network" envconfig:"domain"`

	// ErrorURL is the error handler url.
	ErrorURL string `default:"https://hyperprivacy.network/error" envconfig:"error_url"`

	// Port is the port the server will listen on.
	Port int `default:"9090" envconfig:"port"`

	RedirectOrigin bool `default:"true" envconfig:"redirect_origin"`
}

// Initialize loads the config from the environment and save it into the global config variable.
func Initialize() error {
	config = &Config{}
	return envconfig.Process("", config)
}

// Get returns the config. This should only be called after initialize!
func Get() *Config {
	if config == nil {
		panic("Configration not initialized!")
	}

	return config
}
