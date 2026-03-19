import React from "react";
import { TimeToLeave } from "@mui/icons-material";

export const HeaderLayout = () => {
    const icons =
        "🌱 🌴 🌵 🌷 🌸 🌹 🌺 🌻 🌼 💐 🌾 🌿 🍀 🍁 🍂 🍃 🍄 🌰 🐭 🐹 🐮 🐯 🐇 🐰 🐈 🐱 �� 🐴 🐑 🐔 🐤 🐣 🐥 🐦 🐧 🐘 🐫 🐗 🐷 🐽 🐕 🐩 🐶 🐺 🐻 🐨 🐼 🐵 🐒 🐲 🐍 🐢 🐸 🐳 🐬 🐙 🐟 🐠 🐡 🐚 🐌 🐛 🐜 🐝 🐞 🐾";
    const rand = Math.floor(Math.random() * 10);
    const icon = icons.slice(rand * 2, rand * 2 + 3);

    return (
        <header>
            <div className="flex flex-row flex-wrap items-center justify-around" dir="rtl">
                <div className="text-[3rem] m-0 p-[5px] flex flex-row justify-center items-center">
                    <TimeToLeave sx={{ marginTop: "10px", fontSize: "3rem" }} />{" "}
                    &nbsp; סידור{" "}
                </div>
                <div className="text-[48px]">{icon}</div>
            </div>
        </header>
    );
};
