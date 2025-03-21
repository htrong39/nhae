document.addEventListener("DOMContentLoaded", function () {
    let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    let lastOrder = orderHistory[orderHistory.length - 1];

    if (!lastOrder) {
        document.getElementById("review-container").innerHTML = "<p>⚠️ Không có sản phẩm nào để đánh giá.</p>";
        return;
    }

    let reviewContainer = document.getElementById("review-container");

    lastOrder.items.forEach((item, index) => {
        let div = document.createElement("div");
        div.classList.add("review-item");
        div.innerHTML = `
            <img src="images/milk1.jpg" alt="${item.name}">
            <div class="product-details">
                <h3>${item.name}</h3>
                <p>${item.price.toLocaleString()} VND</p>
                <div class="star-rating" data-index="${index}">
                    <span class="star" data-value="5">⭐</span>
                    <span class="star" data-value="4">⭐</span>
                    <span class="star" data-value="3">⭐</span>
                    <span class="star" data-value="2">⭐</span>
                    <span class="star" data-value="1">⭐</span>
                </div>
                <textarea class="review-comment" placeholder="Viết bình luận..."></textarea>
            </div>
        `;
        reviewContainer.appendChild(div);
    });

    // Xử lý chọn sao
    document.querySelectorAll(".star-rating").forEach(starContainer => {
        let stars = starContainer.querySelectorAll(".star");
        stars.forEach(star => {
            star.addEventListener("click", function () {
                let value = this.getAttribute("data-value");
                let index = starContainer.getAttribute("data-index");
                localStorage.setItem(`rating-${index}`, value);
                updateStarDisplay(starContainer, value);
            });
        });

        let savedRating = localStorage.getItem(`rating-${starContainer.getAttribute("data-index")}`);
        if (savedRating) {
            updateStarDisplay(starContainer, savedRating);
        }
    });

    function updateStarDisplay(container, value) {
        let stars = container.querySelectorAll(".star");
        stars.forEach(star => {
            if (star.getAttribute("data-value") <= value) {
                star.style.color = "#FFD700"; // Màu vàng
            } else {
                star.style.color = "#ccc"; // Màu xám
            }
        });
    }

    document.getElementById("submit-review").addEventListener("click", function () {
        let comments = document.querySelectorAll(".review-comment");

        lastOrder.items.forEach((item, index) => {
            let rating = localStorage.getItem(`rating-${index}`) || "5"; // Nếu không chọn thì mặc định là 5 sao
            let comment = comments[index].value;

            let productReviews = JSON.parse(localStorage.getItem(`reviews_${item.name}`)) || [];
            productReviews.push({ rating: rating, comment: comment });
            localStorage.setItem(`reviews_${item.name}`, JSON.stringify(productReviews));
        });

        alert("🎉 Cảm ơn bạn đã đánh giá sản phẩm!");
        window.location.href = "index.html";
    });
});
