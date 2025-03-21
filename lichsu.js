document.addEventListener("DOMContentLoaded", function () {
    let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    let orderHistoryContainer = document.getElementById("order-history");

    if (orderHistory.length === 0) {
        orderHistoryContainer.innerHTML = "<p class='no-orders'>Không có đơn hàng nào.</p>";
        return;
    }

    // Nhóm đơn hàng theo ngày
    let groupedOrders = {};

    orderHistory.forEach(order => {
        let orderDate = new Date(order.time);
        let dateKey = orderDate.toLocaleDateString("vi-VN"); // Định dạng ngày (dd/mm/yyyy)

        if (!groupedOrders[dateKey]) {
            groupedOrders[dateKey] = [];
        }
        groupedOrders[dateKey].push(order);
    });

    // Sắp xếp theo ngày từ mới nhất đến cũ nhất
    let sortedDates = Object.keys(groupedOrders).sort((a, b) => {
        let dateA = new Date(a.split("/").reverse().join("-"));
        let dateB = new Date(b.split("/").reverse().join("-"));
        return dateB - dateA;
    });

    // Hiển thị lịch sử mua hàng theo ngày
    sortedDates.forEach(date => {
        let dateSection = document.createElement("div");
        dateSection.classList.add("order-date-section");

        let today = new Date();
        let formattedToday = today.toLocaleDateString("vi-VN");
        let yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        let formattedYesterday = yesterday.toLocaleDateString("vi-VN");

        let dateLabel = date;
        if (date === formattedToday) dateLabel = "📅 Hôm nay";
        else if (date === formattedYesterday) dateLabel = "📅 Hôm qua";

        dateSection.innerHTML = `<h2 class="order-date">${dateLabel}</h2>`;
        
        groupedOrders[date].forEach(order => {
            let orderElement = document.createElement("div");
            orderElement.classList.add("order-card");

            let orderTime = new Date(order.time).toLocaleTimeString("vi-VN"); // Hiển thị giờ, phút

            let totalAmount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            let productList = order.items.map(item => 
                `<li>
                    <a href="menu.html?product=${encodeURIComponent(item.name)}" class="product-link">${item.name}</a> 
                    - ${item.quantity} x ${item.price.toLocaleString()} VND
                </li>`
            ).join("");

            orderElement.innerHTML = `
                <h3>🛍️ Khách hàng: <span class="customer-name">${order.name}</span></h3>
                <p><strong>🕒 Thời gian:</strong> ${orderTime}</p>
                <p><strong>📍 Địa chỉ:</strong> ${order.address}</p>
                <p><strong>💳 Thanh toán:</strong> ${order.paymentMethod}</p>
                <ul>${productList}</ul>
                <p class="total-amount">💰 Tổng tiền: <strong>${totalAmount.toLocaleString()} VND</strong></p>
            `;

            dateSection.appendChild(orderElement);
        });

        orderHistoryContainer.appendChild(dateSection);
    });
});
