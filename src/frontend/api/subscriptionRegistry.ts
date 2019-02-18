import { Subscription } from "apollo-client/util/Observable";

export const subscriptionRegistry: { [id: string]: Subscription } = {};
