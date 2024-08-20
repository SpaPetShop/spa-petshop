export type LoginResponse = {
  tokenModel: {
    accessToken: string;
    refreshToken: string;
  };
  id: string;
  fullName: string;
  role: string;
  status: string;
  username: string;
  image: string
};
