function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    // Hiển thị tin nhắn của người dùng
    const messagesDiv = document.getElementById('chat-messages');
    messagesDiv.innerHTML += `<p><strong>Bạn:</strong> ${message}</p>`;
    input.value = '';

    // Gửi tin nhắn đến backend qua AJAX
    fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        // Hiển thị phản hồi của chatbot
        messagesDiv.innerHTML += `<p><strong>Bot:</strong> ${data.response}</p>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Cuộn xuống cuối
    })
    .catch(error => {
        console.error('Lỗi:', error);
        messagesDiv.innerHTML += `<p><strong>Bot:</strong> Xin lỗi, có lỗi xảy ra.</p>`;
    });
}

// Gửi tin nhắn khi nhấn Enter
document.getElementById('chat-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});