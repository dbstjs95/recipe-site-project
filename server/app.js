const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));

app.post("/auth", (req, res) => {
  const { id_token } = req.body;

  if (!id_token) return res.status(400).send("failed to get id_token");

  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const client = new OAuth2Client(CLIENT_ID);

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const userid = payload["sub"];

    return res.status(200).json({
      message: "success",
      userInfo: payload,
    });
  }

  verify().catch((err) => {
    console.error;
    return res.status(500).json({
      message: "fail",
    });
  });
});

app.post("/naver", async (req, res) => {
  const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
  const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
  const OUR_SERVER_URI = process.env.OUR_SERVER_URI;

  const { code, state } = req.body;

  if (!code || !state) return res.status(400).send("fail");

  const url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&redirect_uri=${OUR_SERVER_URI}&code=${code}&state=${state}`;

  const result = await axios.get(url);
  const { access_token, refresh_token, expires_in } = result.data;

  if (!access_token) return res.status(400).send("fail");
  return res.status(200).json({ access_token, refresh_token });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
