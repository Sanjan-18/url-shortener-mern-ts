import { Router, Request, Response } from "express";
import { Url } from "../models/Url.js";

const router = Router();

router.get("/:code", async (req: Request, res: Response) => {
  try {
    const url = await Url.findOneAndUpdate(
      { shortCode: req.params.code },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!url) return res.status(404).send("Short URL not found.");

    const destination = JSON.stringify(url.originalUrl).replace(/</g, "\\u003c");

    return res.type("html").send(`<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Advertisement - URLShortner</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#080b13;color:#fff;font-family:Inter,Arial,sans-serif}.wrap{width:min(760px,calc(100% - 32px));text-align:center}.ad{min-height:430px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.09);border-radius:16px;background:radial-gradient(circle at 50% 80%,rgba(255,151,69,.35),transparent 30%),linear-gradient(135deg,#11162a,#3a172e 55%,#6f2929);box-shadow:0 25px 80px rgba(0,0,0,.45);padding:40px 24px}.label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.48);margin-bottom:22px}.ad-space{width:min(560px,100%);height:210px;border:1px dashed rgba(255,255,255,.18);border-radius:10px;display:grid;place-items:center;color:rgba(255,255,255,.38);font-size:14px;background:rgba(0,0,0,.12)}.timer{margin-top:25px;font-size:42px;font-weight:700}.message{margin-top:5px;color:rgba(255,255,255,.7);font-size:14px}.continue{margin-top:24px;border:0;border-radius:8px;padding:12px 25px;background:#2563eb;color:white;font-weight:600;cursor:pointer;opacity:.45;pointer-events:none}.continue.ready{opacity:1;pointer-events:auto}.continue.ready:hover{background:#3b82f6}
</style>
</head>
<body><main class="wrap"><section class="ad"><div class="label">Advertisement</div><div class="ad-space">AD SPACE</div><div id="timer" class="timer">5</div><div id="message" class="message">Your link is being prepared. Please wait 5 seconds.</div><button id="continue" class="continue" type="button">Continue to destination</button></section></main>
<script>
const destination=${destination};let seconds=5;const timer=document.getElementById("timer"),message=document.getElementById("message"),button=document.getElementById("continue");const interval=setInterval(()=>{seconds-=1;timer.textContent=seconds;if(seconds<=0){clearInterval(interval);timer.textContent="✓";message.textContent="Your link is ready.";button.classList.add("ready");}},1000);button.addEventListener("click",()=>window.location.replace(destination));
</script></body></html>`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Redirect failed.");
  }
});

export default router;
