export type Maybe<T> = T | null;

export interface LoginInput {
  username: string;

  password: string;
}

export interface RegisterSensorInput {
  mac: string;

  type: string;

  name: string;

  description?: Maybe<string>;
}

export interface PublishEventInput {
  deviceId: string;

  type: string;

  data?: Maybe<string>;
}

export interface RevokeSensorInput {
  mac: string;
}

export type DateTime = any;

export type Binary = any;

// ====================================================
// Scalars
// ====================================================

// ====================================================
// Types
// ====================================================

export interface Query {
  viewer?: Maybe<User>;

  events?: Maybe<Event[]>;

  devices: Device[];

  organization?: Maybe<Organization>;
}

export interface User {
  id: string;

  username: string;

  email?: Maybe<string>;

  firstname: string;

  lastname: string;
}

export interface Event {
  device: Device;

  data: any;
}

export interface Device {
  id: string;

  mac: string;

  type: string;

  name: string;

  description: string;
}

export interface Organization {
  id: string;

  name: string;
}

export interface Mutation {
  login?: Maybe<string>;

  registerSensor?: Maybe<Device>;

  revokeSensor: boolean;

  publishEvent: Event;
}

export interface Subscription {
  events?: Maybe<Event[]>;
}

// ====================================================
// Arguments
// ====================================================

export interface LoginMutationArgs {
  input?: Maybe<LoginInput>;
}
export interface RegisterSensorMutationArgs {
  input: RegisterSensorInput;
}
export interface RevokeSensorMutationArgs {
  input: RegisterSensorInput;
}
export interface PublishEventMutationArgs {
  input: PublishEventInput;
}

import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";

export type Resolver<Result, Parent = {}, Context = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo,
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo,
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo,
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<
  Result,
  Parent = {},
  Context = {},
  Args = {}
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<Result, Parent, Context, Args>)
  | ISubscriptionResolverObject<Result, Parent, Context, Args>;

export type TypeResolveFn<Types, Parent = {}, Context = {}> = (
  parent: Parent,
  context: Context,
  info: GraphQLResolveInfo,
) => Maybe<Types>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult, TArgs = {}, TContext = {}> = (
  next: NextResolverFn<TResult>,
  source: any,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export namespace QueryResolvers {
  export interface Resolvers<Context = {}, TypeParent = {}> {
    viewer?: ViewerResolver<Maybe<User>, TypeParent, Context>;

    events?: EventsResolver<Maybe<Event[]>, TypeParent, Context>;

    devices?: DevicesResolver<Device[], TypeParent, Context>;

    organization?: OrganizationResolver<
      Maybe<Organization>,
      TypeParent,
      Context
    >;
  }

  export type ViewerResolver<
    R = Maybe<User>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type EventsResolver<
    R = Maybe<Event[]>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DevicesResolver<
    R = Device[],
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type OrganizationResolver<
    R = Maybe<Organization>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace UserResolvers {
  export interface Resolvers<Context = {}, TypeParent = User> {
    id?: IdResolver<string, TypeParent, Context>;

    username?: UsernameResolver<string, TypeParent, Context>;

    email?: EmailResolver<Maybe<string>, TypeParent, Context>;

    firstname?: FirstnameResolver<string, TypeParent, Context>;

    lastname?: LastnameResolver<string, TypeParent, Context>;
  }

  export type IdResolver<R = string, Parent = User, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UsernameResolver<
    R = string,
    Parent = User,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type EmailResolver<
    R = Maybe<string>,
    Parent = User,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type FirstnameResolver<
    R = string,
    Parent = User,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type LastnameResolver<
    R = string,
    Parent = User,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace EventResolvers {
  export interface Resolvers<Context = {}, TypeParent = Event> {
    device?: DeviceResolver<Device, TypeParent, Context>;

    data?: DataResolver<Maybe<string>, TypeParent, Context>;
  }

  export type DeviceResolver<
    R = Device,
    Parent = Event,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DataResolver<
    R = Maybe<string>,
    Parent = Event,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace DeviceResolvers {
  export interface Resolvers<Context = {}, TypeParent = Device> {
    id?: IdResolver<string, TypeParent, Context>;

    mac?: MacResolver<string, TypeParent, Context>;

    type?: TypeResolver<string, TypeParent, Context>;

    name?: NameResolver<string, TypeParent, Context>;

    description?: DescriptionResolver<string, TypeParent, Context>;
  }

  export type IdResolver<R = string, Parent = Device, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type MacResolver<R = string, Parent = Device, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type TypeResolver<
    R = string,
    Parent = Device,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string,
    Parent = Device,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DescriptionResolver<
    R = string,
    Parent = Device,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace OrganizationResolvers {
  export interface Resolvers<Context = {}, TypeParent = Organization> {
    id?: IdResolver<string, TypeParent, Context>;

    name?: NameResolver<string, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = Organization,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string,
    Parent = Organization,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = {}> {
    login?: LoginResolver<Maybe<string>, TypeParent, Context>;

    registerSensor?: RegisterSensorResolver<Maybe<Device>, TypeParent, Context>;

    revokeSensor?: RevokeSensorResolver<boolean, TypeParent, Context>;

    publishEvent?: PublishEventResolver<Event, TypeParent, Context>;
  }

  export type LoginResolver<
    R = Maybe<string>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, LoginArgs>;
  export interface LoginArgs {
    input?: Maybe<LoginInput>;
  }

  export type RegisterSensorResolver<
    R = Maybe<Device>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, RegisterSensorArgs>;
  export interface RegisterSensorArgs {
    input: RegisterSensorInput;
  }

  export type RevokeSensorResolver<
    R = boolean,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, RevokeSensorArgs>;
  export interface RevokeSensorArgs {
    input: RegisterSensorInput;
  }

  export type PublishEventResolver<
    R = Event,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, PublishEventArgs>;
  export interface PublishEventArgs {
    input: PublishEventInput;
  }
}

export namespace SubscriptionResolvers {
  export interface Resolvers<Context = {}, TypeParent = {}> {
    events?: EventsResolver<Maybe<Event[]>, TypeParent, Context>;
  }

  export type EventsResolver<
    R = Maybe<Event[]>,
    Parent = {},
    Context = {}
  > = SubscriptionResolver<R, Parent, Context>;
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  SkipDirectiveArgs,
  {}
>;
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  {}
>;
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  {}
>;
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string;
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<DateTime, any> {
  name: "DateTime";
}
export interface BinaryScalarConfig
  extends GraphQLScalarTypeConfig<Binary, any> {
  name: "Binary";
}

export interface IResolvers<Context = {}> {
  Query?: QueryResolvers.Resolvers<Context>;
  User?: UserResolvers.Resolvers<Context>;
  Event?: EventResolvers.Resolvers<Context>;
  Device?: DeviceResolvers.Resolvers<Context>;
  Organization?: OrganizationResolvers.Resolvers<Context>;
  Mutation?: MutationResolvers.Resolvers<Context>;
  Subscription?: SubscriptionResolvers.Resolvers<Context>;
  DateTime?: GraphQLScalarType;
  Binary?: GraphQLScalarType;
}

export interface IDirectiveResolvers<Result> {
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
}
