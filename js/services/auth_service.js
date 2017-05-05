import { Settings } from "./settings";

export class AuthService {
  static login(state) {
    return fetch(Settings.authUrl, {
              method : 'POST',
              headers: {
                'Accept'      : 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(state)
            }).then((response) => {
              return response.json();
          });
  }
}