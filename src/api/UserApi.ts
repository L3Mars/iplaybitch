import Axios from 'axios';
import { UserModule } from '@/store/modules/user';
import { UserRegister } from '@/models/User/UserRegister';
import { Utilisateur } from '@/models/Login/utilisateur';

export abstract class UserApi {
  private static axios = Axios.create();

  static async login(userInfo: { login: string; password: string }): Promise<string> {
    const response = await this.axios.post(`${process.env.VUE_APP_ApiUrl}/api/v1/users/sign_in`, userInfo);
    return response.headers['access-token'];
  }

  static async register(userInfo: UserRegister): Promise<any> {
    await this.axios.post(`${process.env.VUE_APP_ApiUrl}/api/v1/users/sign_up`, userInfo);
  }

  static async getConnected(): Promise<Utilisateur> {
    const response = await this.axios.get(`${process.env.VUE_APP_ApiUrl}/api/v1/user`, {
      headers: { Authorization: `Bearer ${UserModule.token}` }
    });
    return response.data;
  }

  static async updateFirebaseToken(firebaseToken: string): Promise<void> {
    await this.axios.post(
      `${process.env.VUE_APP_ApiUrl}/api/v1/user/user_firebase_tokens`,
      // eslint-disable-next-line @typescript-eslint/camelcase
      { firebase_token: firebaseToken },
      { headers: { Authorization: `Bearer ${UserModule.token}` } }
    );
  }

  static async addFriend(username: string): Promise<Utilisateur> {
    const response = await this.axios.post(
      `${process.env.VUE_APP_ApiUrl}/api/v1/user/friendships`,
      { username: username },
      { headers: { Authorization: `Bearer ${UserModule.token}` } }
    );
    return new Utilisateur(response.data);
  }

  static async updateFriendship(id: number, statut: string, sub: boolean): Promise<Utilisateur> {
    const friendResponse = { status: statut, subscribed: sub };
    const response = await this.axios.put(
      `${process.env.VUE_APP_ApiUrl}/api/v1/user/friendships/${id}`,
      friendResponse,
      { headers: { Authorization: `Bearer ${UserModule.token}` } }
    );
    return new Utilisateur(response.data);
  }
}
