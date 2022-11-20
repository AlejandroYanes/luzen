export interface NotificationTemplate {
  template: {
    _id: string;
    name: string;
    critical: boolean;
  };
  preference: {
    enabled: boolean;
    channels: {
      email: boolean;
      in_app: boolean;
    };
  };
}
