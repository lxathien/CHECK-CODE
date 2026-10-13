/* ==========================================================================
   validate.js
   Người phụ trách: Thiên
   Chức năng: Kiểm tra dữ liệu nhập và hiển thị lỗi cho form
   ========================================================================== */


(function () {
    "use strict";

    // Kiểm tra giá trị không được để trống.

    function isRequired(value) {
        return value !== null && value !== undefined && String(value).trim() !== "";
    }


    // Kiểm tra độ dài tối thiểu.

    function minLength(value, minLength) {
        if(!isRequired(value) || !Number.isFinite(minLength) || minLength < 0) {
            return false;
        }
        return String(value).trim().length >= minLength;
    }


    // Kiểm tra định dạng email cơ bản.

    function isEmail(value) {
        if(!isRequired(value)) {
            return false;
        }
        var email = String(value).trim();
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }


    // Kiểm tra số điện thoại Việt Nam gồm 10 chữ số, bắt đầu bằng 0.

    function isPhoneVN(value) {
        if (!isRequired(value)) {
            return false;
        }
        var phoneVN = String(value).trim();
        var phoneVNPattern = /^0[3-9][0-9]{8}$/;
        return phoneVNPattern.test(phoneVN);
    }


    // Tìm vùng hiển thị lỗi hoặc tạo vùng mới nếu chưa có.

    function getFeedbackElement(input) {
        var feedback = input.nextElementSibling;

        if (feedback && feedback.classList.contains("invalid-feedback")) {
        return feedback;
        }

        feedback = input.parentElement.querySelector(".invalid-feedback");

        if (!feedback) {
        feedback = document.createElement("div");
        feedback.className = "invalid-feedback";
        input.insertAdjacentElement("afterend", feedback);
        }

        return feedback;
    }


    // Hiển thị lỗi dưới ô nhập và thêm viền đỏ theo Bootstrap.

    function showFieldError(input, message) {
        if (!input || !input.classList) {
        return;
        }

        var feedback = getFeedbackElement(input);

        input.classList.add("is-invalid");
        input.setAttribute("aria-invalid", "true");
        feedback.textContent = message || "Vui lòng kiểm tra lại thông tin.";
    }


    // Xóa lỗi của ô nhập.

    function clearFieldError(input) {
        if (!input || !input.classList) {
        return;
        }

        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");

        var feedback = input.nextElementSibling;

        if (feedback && feedback.classList.contains("invalid-feedback")) {
        feedback.textContent = "";
        return;
        }

        feedback = input.parentElement
        ? input.parentElement.querySelector(".invalid-feedback")
        : null;

        if (feedback) {
        feedback.textContent = "";
        }
    }
    window.isRequired = isRequired;
    window.minLength = minLength;
    window.isEmail = isEmail;
    window.isPhoneVN = isPhoneVN;
    window.showFieldError = showFieldError;
    window.clearFieldError = clearFieldError;
})();



