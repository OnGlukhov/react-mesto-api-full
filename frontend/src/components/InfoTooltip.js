import React from "react";
const InfoTooltip = ({ isOpen, onClose, title, icon }) => {
  return (
    <div className={`popup ${isOpen && "popup_opened"}`}>
      <div className="popup__container">
        <img src={icon} alt="Статус" className="popup__status" />
        <button
          onClick={onClose}
          type="button"
          className="popup__close"
        ></button>
        <h3 className="popup__title_status">{title}</h3>
      </div>
    </div>
  );
};
export default InfoTooltip;
