function customAlert({ message, title = "", type = "info", duration = 3000 }) {

    let container = document.getElementById("notification-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "notification-container";
        container.style.position = "fixed";
        container.style.top = "20px";
        container.style.left = "50%";
        container.style.transform = "translate(-50%)";
        container.style.zIndex = "9999";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.alignItems = "center";
        container.style.borderRadius = "8px";
        container.style.background = "transparent";
        document.body.appendChild(container);
    }


    const notification = document.createElement("div");
    notification.className = `notification ${type}`;


    let bgColor, textColor, iconColor, iconClass;
    if (type === "success") {
        bgColor = "#d4edda";
        textColor = "#155724";
        iconClass = "fas fa-check-circle";
        iconColor = "#155724";
    } else if (type === "error") {
        bgColor = "#f8d7da";
        textColor = "#721c24";
        iconClass = "fas fa-times-circle";
        iconColor = "#721c24";
    } else if (type === "warning") {
        bgColor = "#fff3cd";
        textColor = "#856404";
        iconClass = "fas fa-exclamation-circle";
        iconColor = "#856404";
    } else {
        bgColor = "#cce5ff";
        textColor = "#004085";
        iconClass = "fas fa-info-circle";
        iconColor = "#004085";
    }

    notification.style.backgroundColor = bgColor;
    notification.style.color = textColor;
    notification.style.padding = "10px 20px";
    notification.style.marginBottom = "10px";
    notification.style.fontSize = "16px";
    notification.style.fontWeight = "bold";
    notification.style.textAlign = "center";
    notification.style.opacity = "0";
    notification.style.transform = "translateY(-20px)";
    notification.style.transition = "all 0.5s ease";
    notification.style.width = "auto";

    notification.innerHTML = `
    <div>
        ${title ? `<h4 style="margin: 0; font-size: 18px; font-weight: bold;">${title}</h4>` : ''}
    </div>
    <div>
       <i class="${iconClass}" style="font-size: 20px; color: ${iconColor};"></i>
       <span>${message}</span>
    </div>
    `;

    container.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = "1";
        notification.style.transform = "translateY(0)";
    }, 10);


    setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transform = "translateY(-20px)";


        setTimeout(() => {
            notification.innerHTML = '';


            if (container.children.length === 0) {
                container.remove();
            }
        }, 500);
    }, duration);
}