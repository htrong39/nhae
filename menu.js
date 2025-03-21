document.addEventListener("DOMContentLoaded", function () {
    let productGrid = document.querySelector(".product-grid");
    let totalAmountElement = document.getElementById("total-amount");

    let products = [
        { name: "Sữa Hạt Óc Chó", price: 50000, img: "1.png", sold: 120 },
        { name: "Sữa Hạt Bắt", price: 30000, img: "2.png", sold: 80 },
        { name: "Sữa Hạt Mè Đen", price: 35000, img: "3.png", sold: 95 },
        { name: "Sữa Hạnh Nhân", price: 50000, img: "4.png", sold: 120 },
        { name: "Sữa Hạt Macca", price: 30000, img: "5.png", sold: 80 },
        { name: "Sữa Hạnh Nhân - Bắp", price: 35000, img: "6.png", sold: 95 },
        { name: "Sữa Mix Bắp - Mè Đen", price: 50000, img: "7.png", sold: 120 },
        { name: "Sữa Mix Mè Đen - Óc Chó", price: 30000, img: "8.png", sold: 80 },
        { name: "Sữa Mix Óc Chó - Macca", price: 35000, img: "9.png", sold: 95 },
        { name: "Sữa Mix Macca - Hạnh Nhân", price: 50000, img: "10.png", sold: 120 },
    ];

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartSummary() {
        let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (totalAmountElement) totalAmountElement.textContent = total.toLocaleString();
    }

    function addToCart(productName, productPrice) {
        let product = cart.find(p => p.name === productName);
        if (product) {
            product.quantity += 1;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartSummary();
    }

    function getAverageRating(productName) {
        let reviews = JSON.parse(localStorage.getItem(`reviews_${productName}`)) || [];
        if (reviews.length === 0) return "⭐ Chưa có đánh giá";
        let avg = reviews.reduce((sum, r) => sum + parseInt(r.rating), 0) / reviews.length;
        return `⭐ ${avg.toFixed(1)} (${reviews.length} đánh giá)`;
    }

    function renderProducts() {
        products.forEach(product => {
            let productElement = document.createElement("div");
            productElement.classList.add("product");

            let ratingHTML = getAverageRating(product.name);

            productElement.innerHTML = `
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="product-price"><strong>${product.price.toLocaleString()} VND</strong></p>
                <p class="sold-count">🔥 Đã bán: <strong>${product.sold}</strong></p>
                <p class="product-rating">${ratingHTML}</p>
                <button class="buy-button" data-name="${product.name}" data-price="${product.price}">🛒 Thêm vào giỏ hàng</button>
                <button class="view-reviews" data-name="${product.name}">📖 Xem đánh giá</button>
            `;

            productGrid.appendChild(productElement);
        });

        document.querySelectorAll(".buy-button").forEach(button => {
            button.addEventListener("click", function () {
                let productName = this.getAttribute("data-name");
                let productPrice = parseFloat(this.getAttribute("data-price"));
                addToCart(productName, productPrice);
            });
        });

        document.querySelectorAll(".view-reviews").forEach(button => {
            button.addEventListener("click", function () {
                let productName = this.getAttribute("data-name");
                showReviews(productName);
            });
        });

        document.getElementById("go-to-checkout").addEventListener("click", function () {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (cart.length === 0) {
                alert("Giỏ hàng trống! Hãy thêm sản phẩm trước khi thanh toán.");
            } else {
                window.location.href = "banhang.html";
            }
        });
    }

    function showReviews(productName) {
        let productReviews = JSON.parse(localStorage.getItem(`reviews_${productName}`)) || [];
        let reviewHTML = `<h2>📢 Đánh giá cho: ${productName}</h2>`;
        
        if (productReviews.length === 0) {
            reviewHTML += `<p>⚠️ Chưa có đánh giá nào.</p>`;
        } else {
            productReviews.forEach(review => {
                reviewHTML += `
                    <div class="review-item">
                        <p><strong>⭐ ${review.rating} sao</strong></p>
                        <p>${review.comment}</p>
                        <hr>
                    </div>
                `;
            });
        }

        let reviewModal = document.createElement("div");
        reviewModal.id = "review-modal";
        reviewModal.innerHTML = `
            <div class="review-content">
                ${reviewHTML}
                <button id="close-review">❌ Đóng</button>
            </div>
        `;
        document.body.appendChild(reviewModal);

        document.getElementById("close-review").addEventListener("click", function () {
            reviewModal.remove();
        });
    }

    renderProducts();
    updateCartSummary();
});
