import React from "react";
import '/home/adrian-cimsi/CIMSI/frontend/chat-app/src/components/RightSidebar/RightSidebar.css'
import assets from "/home/adrian-cimsi/CIMSI/frontend/chat-app/src/assets/assets";

const RightSidebar = () => {
    return (
        <div className="rs">
            <div className="rs-profile">
                <img src={assets.profile_img} alt="" />
                <h3>Richard Stanford <img src={assets.green_dot} className="dot" alt="" /></h3>
                <p>Hey, There i am Richard using chat app</p>
            </div>
            <hr />
            <div className="rs-media">
                <p>Media</p>
                <div>
                    <img src={assets.pic1} alt="" />
                    <img src={assets.pic2} alt="" />
                    <img src={assets.pic3} alt="" />
                    <img src={assets.pic4} alt="" />
                    <img src={assets.pic1} alt="" />
                    <img src={assets.pic2} alt="" />
                </div>
            </div>
            <button>Logout</button>
        </div>
    )
}

export default RightSidebar
