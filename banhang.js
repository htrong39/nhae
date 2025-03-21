document.addEventListener("DOMContentLoaded", function () {
    let productGrid = document.querySelector(".product-grid");
    let totalAmountElement = document.getElementById("total-amount");

    // Danh sách sản phẩm đầy đủ
    let products = [
        { name: "Sữa Hạt Óc Chó", price: 25000, img: "sữa hạt óc chó.png", sold: 120 },
        { name: "Sữa Hạt Bắt", price: 25000, img: "sữa hạt bắt.png", sold: 80 },
        { name: "Sữa Hạt Mè Đen", price: 25000, img: "sữa hạt mè đen.png", sold: 95 },
        { name: "Sữa Hạt Hạnh Nhân", price: 25000, img: "sữa hạt hạnh nhân.png", sold: 120 },
        { name: "Sữa Hạt Macca", price: 25000, img: "sữa hạt macca.png", sold: 80 },
        { name: "Sữa Mix Hạnh Nhân - Bắp", price: 30000, img: "sữa mix hạnh nhân - bắp.png", sold: 95 },
        { name: "Sữa Mix Bắp - Mè Đen", price: 30000, img: "sữa mix bắp - mè đen.png", sold: 120 },
        { name: "Sữa Mix Mè Đen - Óc Chó", price: 30000, img: "sữa mix mè đen - óc chó.png", sold: 80 },
        { name: "Sữa Mix Óc Chó - Macca", price: 30000, img: "sữa mix óc chó - macca.png", sold: 95 },
        { name: "Sữa Mix Macca - Hạnh Nhân", price: 30000, img: "sữa mix macca - hạnh nhân.png", sold: 120 },
    ];

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let compareList = [];

    // Cập nhật tổng tiền giỏ hàng
    function updateCartSummary() {
        let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (totalAmountElement) totalAmountElement.textContent = total.toLocaleString();
    }

    // Thêm sản phẩm vào giỏ hàng
    function addToCart(productName, productPrice) {
        let quantityInput = document.querySelector(`.quantity-input[data-name="${productName}"]`);
        let quantity = parseInt(quantityInput.value) || 1;
        let product = cart.find(p => p.name === productName);
        if (product) {
            product.quantity += quantity;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: quantity, img: products.find(p => p.name === productName).img });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartSummary();
        quantityInput.value = 1;
    }

    // Tính điểm đánh giá trung bình
    function getAverageRating(productName) {
        let reviews = JSON.parse(localStorage.getItem(`reviews_${productName}`)) || [];
        if (reviews.length === 0) return "⭐ Chưa có đánh giá";
        let avg = reviews.reduce((sum, r) => sum + parseInt(r.rating), 0) / reviews.length;
        return `⭐ ${avg.toFixed(1)} (${reviews.length} đánh giá)`;
    }

    // Kiểm tra xem sản phẩm đã được nhận hàng chưa
    function canReviewProduct(productName) {
        let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
        return orderHistory.some(order => 
            order.status === "delivered" && 
            order.items.some(item => item.name === productName)
        );
    }

    // Hiển thị danh sách sản phẩm
    function renderProducts(filteredProducts = products) {
        if (!productGrid) return;
        productGrid.innerHTML = "";
        filteredProducts.forEach(product => {
            let productElement = document.createElement("div");
            productElement.classList.add("product");
            productElement.innerHTML = `
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="product-price"><strong>${product.price.toLocaleString()} VND</strong></p>
                <p class="sold-count">🔥 Đã bán: <strong>${product.sold}</strong></p>
                <p class="product-rating">${getAverageRating(product.name)}</p>
                <div class="quantity-selector">
                    <input type="number" class="quantity-input" data-name="${product.name}" value="1" min="1">
                    <button class="buy-button" data-name="${product.name}" data-price="${product.price}">🛒 Thêm vào giỏ</button>
                </div>
                <button class="view-reviews" data-name="${product.name}">📖 Xem đánh giá</button>
                <button class="wishlist-button" data-name="${product.name}">❤️ Yêu thích</button>
                <button class="share-button" data-name="${product.name}">📤 Chia sẻ</button>
                <button class="compare-button" data-name="${product.name}">⚖️ So sánh</button>
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
        document.querySelectorAll(".wishlist-button").forEach(button => {
            button.addEventListener("click", function () {
                let productName = this.getAttribute("data-name");
                toggleWishlist(productName);
            });
        });
        document.querySelectorAll(".share-button").forEach(button => {
            button.addEventListener("click", function () {
                let productName = this.getAttribute("data-name");
                shareProduct(productName);
            });
        });
        document.querySelectorAll(".compare-button").forEach(button => {
            button.addEventListener("click", function () {
                let productName = this.getAttribute("data-name");
                let product = products.find(p => p.name === productName);
                toggleCompare(product);
            });
        });

        updateWishlistButtons();
    }

    // Hiển thị đánh giá và kiểm tra điều kiện viết đánh giá
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
                ${canReviewProduct(productName) ? '<button id="write-review-btn">✍️ Viết đánh giá</button>' : '<p>⚠️ Bạn cần nhận hàng để viết đánh giá.</p>'}
                <button id="close-review">❌ Đóng</button>
            </div>
        `;
        document.body.appendChild(reviewModal);

        document.getElementById("close-review").addEventListener("click", () => reviewModal.remove());
        if (canReviewProduct(productName)) {
            document.getElementById("write-review-btn").addEventListener("click", () => {
                reviewModal.remove();
                showReviewForm(productName);
            });
        }
    }

    // Hiển thị form viết đánh giá
    function showReviewForm(productName) {
        let reviewFormModal = document.createElement("div");
        reviewFormModal.id = "review-form-modal";
        reviewFormModal.innerHTML = `
            <div class="review-form-content">
                <h3>Viết đánh giá cho ${productName}</h3>
                <label for="rating">Chọn số sao:</label>
                <select id="rating" required>
                    <option value="5">5 sao</option>
                    <option value="4">4 sao</option>
                    <option value="3">3 sao</option>
                    <option value="2">2 sao</option>
                    <option value="1">1 sao</option>
                </select>
                <label for="comment">Bình luận:</label>
                <textarea id="comment" placeholder="Nhập bình luận của bạn" required></textarea>
                <button id="submit-review">Gửi đánh giá</button>
            </div>
        `;
        document.body.appendChild(reviewFormModal);

        document.getElementById("submit-review").addEventListener("click", () => {
            let rating = document.getElementById("rating").value;
            let comment = document.getElementById("comment").value.trim();
            if (!comment) {
                alert("⚠️ Vui lòng nhập bình luận!");
                return;
            }
            let reviews = JSON.parse(localStorage.getItem(`reviews_${productName}`)) || [];
            reviews.push({ rating, comment });
            localStorage.setItem(`reviews_${productName}`, JSON.stringify(reviews));
            alert("✅ Đánh giá đã được gửi!");
            reviewFormModal.remove();
            renderProducts();
            showReviews(productName);
        });
    }

    // Chức năng yêu thích
    function toggleWishlist(productName) {
        let index = wishlist.indexOf(productName);
        if (index === -1) wishlist.push(productName);
        else wishlist.splice(index, 1);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        updateWishlistButtons();
    }

    function updateWishlistButtons() {
        document.querySelectorAll(".wishlist-button").forEach(button => {
            let productName = button.getAttribute("data-name");
            button.classList.toggle("active", wishlist.includes(productName));
        });
    }

    // Tìm kiếm sản phẩm
    function filterProducts(query) {
        let filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
        renderProducts(filtered);
    }

    // Lọc sản phẩm
    function sortProducts(option) {
        let sorted = [...products];
        if (option === "price-asc") sorted.sort((a, b) => a.price - b.price);
        else if (option === "price-desc") sorted.sort((a, b) => b.price - a.price);
        else if (option === "sold-desc") sorted.sort((a, b) => b.sold - a.sold);
        renderProducts(sorted);
    }

    // So sánh sản phẩm
    function toggleCompare(product) {
        let index = compareList.findIndex(p => p.name === product.name);
        if (index === -1 && compareList.length < 3) compareList.push(product);
        else if (index !== -1) compareList.splice(index, 1);
        updateCompareBox();
    }

    function updateCompareBox() {
        let compareBox = document.getElementById("compare-box");
        let compareItems = document.getElementById("compare-items");
        if (!compareBox || !compareItems) return;
        compareBox.style.display = compareList.length > 0 ? "block" : "none";
        compareItems.innerHTML = compareList.map(p => `
            <p>${p.name} - ${p.price.toLocaleString()} VND</p>
        `).join("");
    }

    // Chia sẻ sản phẩm
    function shareProduct(productName) {
        let url = encodeURIComponent(window.location.href);
        let text = encodeURIComponent(`Check out this product: ${productName} on our store!`);
        let shareOptions = `
            <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank">Facebook</a> |
            <a href="https://twitter.com/intent/tweet?text=${text}&url=${url}" target="_blank">Twitter</a> |
            <a href="https://wa.me/?text=${text}%20${url}" target="_blank">WhatsApp</a>
        `;
        let shareModal = document.createElement("div");
        shareModal.id = "share-modal";
        shareModal.innerHTML = `
            <div class="share-content">
                <h3>Chia sẻ ${productName}</h3>
                ${shareOptions}
                <button id="close-share">❌ Đóng</button>
            </div>
        `;
        document.body.appendChild(shareModal);
        document.getElementById("close-share").addEventListener("click", () => shareModal.remove());
    }

    // Tính thời gian giao hàng dự kiến
    function calculateDeliveryTime() {
        let now = new Date();
        let delivery = new Date(now.getTime() + 30 * 60000);
        let deliveryTime = delivery.toLocaleTimeString();
        let deliveryDate = delivery.toLocaleDateString();
        if (document.getElementById("delivery-time")) {
            document.getElementById("delivery-time").textContent = `${deliveryTime} - ${deliveryDate}`;
        }
    }

    // Hiển thị giỏ hàng
    function renderCart() {
        let cartItemsContainer = document.getElementById("cart-items");
        let totalPriceElement = document.getElementById("total-price");
        if (!cartItemsContainer || !totalPriceElement) return;

        cartItemsContainer.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>⚠️ Giỏ hàng trống! Hãy quay lại menu để thêm sản phẩm.</p>";
            totalPriceElement.textContent = "0";
            return;
        }

        cart.forEach((item, index) => {
            let itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="item-details">
                    <p><strong>${item.name}</strong></p>
                    <p>${item.quantity} x ${item.price.toLocaleString()} VND</p>
                </div>
                <button class="remove-item" data-index="${index}">🗑 Hủy</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        totalPriceElement.textContent = total.toLocaleString();

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function () {
                let index = this.getAttribute("data-index");
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            });
        });
    }

    // Xử lý thanh toán
    let checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (event) {
            event.preventDefault();
            let name = document.getElementById("name").value.trim();
            let phone = document.getElementById("phone").value.trim();
            let address = document.getElementById("address").value.trim();
            let paymentMethod = document.getElementById("payment-method").value;
            let orderNote = document.getElementById("order-note").value.trim();

            if (!name || !phone || !address) {
                alert("⚠️ Vui lòng nhập đầy đủ thông tin (họ tên, số điện thoại, địa chỉ)!");
                return;
            }
            if (!/^[0-9]{10}$/.test(phone)) {
                alert("⚠️ Số điện thoại phải gồm 10 chữ số!");
                return;
            }
            if (cart.length === 0) {
                alert("⚠️ Giỏ hàng trống! Không thể thanh toán.");
                return;
            }

            let timestamp = new Date().toLocaleString();
            let order = { name, phone, address, paymentMethod, items: cart, time: timestamp, note: orderNote, status: "pending" };
            let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
            orderHistory.push(order);
            localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

            alert(`🎉 Đơn hàng đã được đặt!\n👤 ${name}\n📞 ${phone}\n📍 ${address}\n💳 ${paymentMethod}\n✏️ Ghi chú: ${orderNote || "Không có"}`);
            localStorage.removeItem("cart");
            window.location.href = "lichsu.html";
        });
    }

    // Hiển thị lịch sử giao dịch và xác nhận nhận hàng
    function renderOrderHistory() {
        let orderHistoryContainer = document.getElementById("order-history");
        if (!orderHistoryContainer) return;

        let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
        orderHistoryContainer.innerHTML = "";

        if (orderHistory.length === 0) {
            orderHistoryContainer.innerHTML = "<p>⚠️ Chưa có đơn hàng nào.</p>";
            return;
        }

        orderHistory.forEach((order, index) => {
            let orderElement = document.createElement("div");
            orderElement.classList.add("order-item");
            let itemsHTML = order.items.map(item => `
                <p>${item.name} - ${item.quantity} x ${item.price.toLocaleString()} VND</p>
            `).join("");
            orderElement.innerHTML = `
                <h3>Đơn hàng #${index + 1} - ${order.time}</h3>
                <p><strong>Khách hàng:</strong> ${order.name}</p>
                <p><strong>SĐT:</strong> ${order.phone}</p>
                <p><strong>Địa chỉ:</strong> ${order.address}</p>
                <p><strong>Thanh toán:</strong> ${order.paymentMethod}</p>
                <p><strong>Ghi chú:</strong> ${order.note || "Không có"}</p>
                <div>${itemsHTML}</div>
                <p><strong>Trạng thái:</strong> ${order.status === "pending" ? "Đang xử lý" : "Đã nhận hàng"}</p>
                ${order.status === "pending" ? `<button class="confirm-delivery" data-index="${index}">✅ Xác nhận nhận hàng</button>` : ""}
            `;
            orderHistoryContainer.appendChild(orderElement);
        });

        document.querySelectorAll(".confirm-delivery").forEach(button => {
            button.addEventListener("click", function () {
                let index = this.getAttribute("data-index");
                orderHistory[index].status = "delivered";
                localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
                renderOrderHistory();
            });
        });
    }

    // Gắn sự kiện
    if (document.getElementById("search-button")) {
        document.getElementById("search-button").addEventListener("click", () => {
            let query = document.getElementById("search-input").value;
            filterProducts(query);
        });
    }
    if (document.getElementById("search-input")) {
        document.getElementById("search-input").addEventListener("keyup", (e) => {
            if (e.key === "Enter") filterProducts(e.target.value);
        });
    }
    if (document.getElementById("filter-options")) {
        document.getElementById("filter-options").addEventListener("change", (e) => sortProducts(e.target.value));
    }
    if (document.getElementById("go-to-checkout")) {
        document.getElementById("go-to-checkout").addEventListener("click", () => {
            if (cart.length === 0) alert("Giỏ hàng trống! Hãy thêm sản phẩm trước khi thanh toán.");
            else window.location.href = "banhang.html";
        });
    }
    if (document.getElementById("clear-compare")) {
        document.getElementById("clear-compare").addEventListener("click", () => {
            compareList = [];
            updateCompareBox();
        });
    }

    // Pop-up khuyến mãi
    let promoPopup = document.getElementById("promo-popup");
    let closePromo = document.getElementById("close-promo");
    if (promoPopup && closePromo) {
        setTimeout(() => promoPopup.style.display = "flex", 1000);
        closePromo.addEventListener("click", () => promoPopup.style.display = "none");
    }

    // Khởi chạy
    renderProducts();
    updateCartSummary();
    calculateDeliveryTime();
    renderCart();
    renderOrderHistory();
});