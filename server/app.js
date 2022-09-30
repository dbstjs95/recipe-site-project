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

  const CLIENT_ID = process.env.CLIENT_ID;
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

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
