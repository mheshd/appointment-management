import { Client, Account, ID } from "appwrite";
import config from "./Config";

export class Authservice {
  client = new Client();
  account;
  constructor() {
    this.client
      .setEndpoint(config.appWriteUrl)
      .setProject(config.appWriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount(email, password, name) {
    try {
      // Verify parameters exist first
      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }
      const useraccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (useraccount) {
        return this.Login({ email, password });
      } else {
        return useraccount;
      }
    } catch (error) {
      throw error.message;
    }
  }

  async Login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error.message;
    }
  }

  async getUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("appwrite service :: getcurrentuser :: error ", error);
    }
    return null;
  }

  async Logout() {
    try {
      return await this.account.deleteSessions("current");
    } catch (error) {
      console.log("appwrite service :: logout :: error ", error);
    }
  }
  async sendRecoveryEmail(email) {
    const urlForReset = "http://localhost:5173/reset-password";
    try {
      await this.account.createRecovery(email, urlForReset);
      alert("Check your email for password reset instructions!");
    } catch (error) {
      console.error("Failed to send recovery email:", err.message);
    }
  }

  async resetPassword(userId, secret, pw, confirm) {
    try {
      await this.account.updateRecovery(userId, secret, pw, confirm);
      alert("Password reset! You can now log in with your new password.");
    } catch (err) {
      console.error("Reset failed:", err.message);
    }
  }
}

const authservice = new Authservice();
export default authservice;
