
document.addEventListener("DOMContentLoaded", function () {
    const fields = {
        "full-name": document.getElementById("full-name"),
        phone: document.getElementById("phone"),
        email: document.getElementById("email"),
        province: document.getElementById("province"),
        district: document.getElementById("district"),
        ward: document.getElementById("ward"),
        address: document.getElementById("address")
    };

    const saveButton = document.getElementById("save-shipping");

    // Kiểm tra một trường bằng các hàm dùng chung.
    function validateField(input) {
        if (!input) return true;

        const value = input.value.trim();
        let message = "";

        if (!isRequired(value)) {
            message = "Vui lòng nhập hoặc chọn thông tin này.";
        } else if (
            input.id === "phone" &&
            !isPhoneVN(value)
        ) {
            message = "Số điện thoại không hợp lệ.";
        } else if (
            input.id === "email" &&
            !isEmail(value)
        ) {
            message = "Email không hợp lệ.";
        } else if (
            input.id === "full-name" &&
            value.split(/\s+/).length < 2
        ) {
            message = "Họ và tên phải có ít nhất 2 từ.";
        }

        if (message) {
            showFieldError(input, message);
            return false;
        }

        clearFieldError(input);
        return true;
    }

    // Kiểm tra khi rời ô nhập.
    Object.values(fields).forEach(function (input) {
        if (!input) return;

        input.addEventListener("blur", function () {
            validateField(input);
        });

        input.addEventListener("input", function () {
            if (input.classList.contains("is-invalid")) {
                validateField(input);
            }
        });

        input.addEventListener("change", function () {
            if (input.classList.contains("is-invalid")) {
                validateField(input);
            }
        });
    });

    // Kiểm tra tất cả trường khi bấm Lưu thông tin.
    if (saveButton) {
        saveButton.addEventListener("click", function () {
            let isValid = true;

            Object.values(fields).forEach(function (input) {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                const firstInvalid = document.querySelector(
                    ".card .is-invalid"
                );

                if (firstInvalid) {
                    firstInvalid.focus();
                }

                return;
            }

            const shippingInfo = {};

            Object.entries(fields).forEach(function ([key, input]) {
                shippingInfo[key] = input.value.trim();
            });

            localStorage.setItem(
                "sv_checkout_draft",
                JSON.stringify(shippingInfo)
            );

            alert("Đã lưu thông tin giao hàng!");
        });
    }
});
