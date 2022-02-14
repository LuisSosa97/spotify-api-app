import axios from "axios";
import qs from 'qs';
import Cookies from "universal-cookie/es6";
import { Buffer } from 'buffer';
const cookie = new Cookies();


const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const SECRET_ID = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const AUTH_TOKEN = Buffer(`${CLIENT_ID}:${SECRET_ID}`, "utf-8").toString("base64");

export const getSpotifyToken = async () => {
    try {
        const token_url = "https://accounts.spotify.com/api/token";
        const data = qs.stringify({ grant_type: "client_credentials" });

        const response = await axios.post(token_url, data, {
            headers: {
                Authorization: `Basic ${AUTH_TOKEN}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        cookie.set("token", response.data.access_token, { path: "/" });
    } catch (err) {
        console.log(err);
    }

}

export const spotifySearch = async (type, query) => {
    const access_token = cookie.get("token");
    if (type === "all") {
        type = ["album", "artist", "track"]
    }
    try {
        const api_url = `https://api.spotify.com/v1/search?type=${type}&q=${query}&include_external=audio`;
        const response = await axios.get(api_url, { headers: { Authorization: `Bearer ${access_token}` } });

        return response.data;
    } catch (err) {
        console.log(err);
    }


}

