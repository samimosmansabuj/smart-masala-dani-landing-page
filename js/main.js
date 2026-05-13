let PRODUCT_DATA = null;

// =========================
// Utility Functions
// =========================

function toBanglaNumber(number) {
    const eng = "0123456789";
    const bang = "০১২৩৪৫৬৭৮৯";

    return number.toString().split("").map(d =>
        bang[eng.indexOf(d)] || d
    ).join("");
}

function toEnglishNumber(number) {
    const bang = "০১২৩৪৫৬৭৮৯";
    const eng = "0123456789";

    return number.toString().split("").map(d =>
        eng[bang.indexOf(d)] || d
    ).join("");
}

function isValidBDPhoneNew(phone) {
    phone = toEnglishNumber(phone);

    const regex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;
    return regex.test(phone);
}

// =========================
// Product Fetch
// =========================
(async function () {
    try {
        const response = await fetch(
            `${ENV.API_BASE_URL}/site/api/landing-page/${ENV.PRODUCT_LANDING_PAGE_ID}/`
        );
        const response_data = await response.json();
        if (response_data.status) {
            PRODUCT_DATA = response_data.data.product[0];
            setupProductData();
            setupGallery();
            updateSummary();
        } else {
            console.log("Product fetch error");
        }
    } catch (e) {
        console.log("Fetch Error:", e);
    }
})();

function setupProductData() {
    document.getElementById("productTitle").textContent = PRODUCT_DATA.name;
    if (PRODUCT_DATA.short_description) {
        document.getElementById("productDescription").innerHTML = PRODUCT_DATA.short_description;
    }
    document.getElementById("heroImage").src = PRODUCT_DATA.images[0].image;
    document.querySelectorAll(".product-old-price").forEach(el => {
        el.textContent = `${toBanglaNumber(Math.floor(PRODUCT_DATA.price))} ৳`;

    });
    document.querySelectorAll(".product-new-price").forEach(el => {
        el.textContent = `${toBanglaNumber(Math.floor(PRODUCT_DATA.discount_price))} ৳`;
    });

}

// =========================
// Gallery
// =========================
function setupGallery() {
    const gallery = document.getElementById("galleryGrid");
    gallery.innerHTML = "";
    PRODUCT_DATA.images.forEach(image => {
        const img = document.createElement("img");
        img.src = image.image;
        img.addEventListener("click", () => {
            document.getElementById("heroImage").src = image.image;
        });
        gallery.appendChild(img);
    });

}

// =========================
// District Fetch
// =========================

const districtSelect =
    document.getElementById("deliverydistrict");

fetch('https://bdapi.vercel.app/api/v.1/district')
    .then(response => response.json())
    .then(data => {

        if (data.status === 200 && data.success) {

            data.data.forEach(district => {

                const option =
                    document.createElement('option');

                option.value =
                    district.name.toLowerCase();

                option.textContent =
                    district.bn_name;

                districtSelect.appendChild(option);

            });

        }

    })
    .catch(error =>
        console.log('District fetch error:', error));

// =========================
// Delivery Charge
// =========================

function getProductDeliveryCharge(product, district) {

    const dc = product.delivery_charge;

    if (!dc) {

        return district === "dhaka"
            ? 80
            : 120;

    }

    if (dc.area_and_charge?.all !== undefined) {
        return dc.area_and_charge.all;
    }

    if (dc.all !== undefined) {
        return dc.all;
    }

    const areaSets =
        ["area-set-1", "area-set-2", "area-set-3"];

    const area_and_charge =
        dc.area_and_charge;

    for (const key of areaSets) {

        if (!area_and_charge[key]) continue;

        const { area, charge } =
            area_and_charge[key];

        if (
            area.includes("all") ||
            area.includes(district)
        ) {

            return charge;

        }

    }

    return district === "dhaka"
        ? 80
        : 120;

}

// =========================
// Price Update
// =========================

const quantity = document.getElementById('quantity');

quantity.addEventListener('change', () => {
    updateSummary();
});

districtSelect.addEventListener("change", () => {
    updateSummary();
});

function updateSummary() {

    if (!PRODUCT_DATA) return;

    const qty =
        Number(quantity.value);

    const productTotal =
        qty * PRODUCT_DATA.discount_price;

    const deliveryCharge =
        getProductDeliveryCharge(
            PRODUCT_DATA,
            districtSelect.value
        );

    const summaryTotal =
        productTotal + deliveryCharge;

    document.getElementById("productTotal").innerText =
        toBanglaNumber(productTotal) + "৳";

    document.getElementById("summaryDelivery").innerText =
        toBanglaNumber(deliveryCharge) + "৳";

    document.getElementById("summaryTotal").innerText =
        toBanglaNumber(summaryTotal) + "৳";

    const inside = 80;
    const outside = 120;

    document.getElementById("deliveryNote").innerText =
        `ঢাকার ভিতরে ${toBanglaNumber(inside)}৳ / ঢাকার বাইরে ${toBanglaNumber(outside)}৳`;

}

// =========================
// FAQ
// =========================

const faqQuestions =
    document.querySelectorAll('.faq-question');

faqQuestions.forEach(item => {

    item.addEventListener('click', () => {

        const answer =
            item.nextElementSibling;

        answer.style.display =
            answer.style.display === 'block'
                ? 'none'
                : 'block';

    });

});

// =========================
// Countdown
// =========================

let time = 21599;

const timer =
    document.getElementById('timer');

setInterval(() => {

    let hours =
        Math.floor(time / 3600);

    let minutes =
        Math.floor((time % 3600) / 60);

    let seconds =
        time % 60;

    timer.innerHTML =
        `${hours}:${minutes}:${seconds}`;

    time--;

}, 1000);

// =========================
// Exit Popup
// =========================

document.addEventListener('mouseleave', () => {

    document.getElementById('popup')
        .style.display = 'flex';

});

function closePopup() {

    document.getElementById('popup')
        .style.display = 'none';

}

// =========================
// Scroll To Order
// =========================

document.querySelectorAll(".orderNowBtn")
    .forEach(btn => {

        btn.addEventListener("click", () => {

            document.getElementById("orderSection")
                .scrollIntoView({
                    behavior: "smooth"
                });

        });

    });

// =========================
// Order Submit
// =========================

document.getElementById("orderForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const submitBtn =
            document.getElementById("submitBtn");

        submitBtn.disabled = true;
        submitBtn.innerHTML = "প্রসেসিং...";

        const customerData = {

            name: document.getElementById("name").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            district: document.getElementById("deliverydistrict").value.trim(),
            address: document.getElementById("address").value.trim(),

        };

        if (
            !customerData.name ||
            !customerData.phone ||
            !customerData.district ||
            !customerData.address
        ) {

            alert("অনুগ্রহ করে সমস্ত তথ্য পূরণ করুন");

            submitBtn.disabled = false;
            submitBtn.innerHTML = "🛒 অর্ডার কনফার্ম করুন";
            return;

        }

        if (!isValidBDPhoneNew(customerData.phone)) {

            alert("সঠিক মোবাইল নাম্বার লিখুন");

            submitBtn.disabled = false;
            submitBtn.innerHTML = "🛒 অর্ডার কনফার্ম করুন";
            return;

        }

        const qty = Number(quantity.value);

        const deliveryCharge =
            getProductDeliveryCharge(PRODUCT_DATA, districtSelect.value);

        const productTotal =
            qty * PRODUCT_DATA.discount_price;

        const summaryTotal =
            productTotal + deliveryCharge;

        const formData = {

            customer: customerData,

            products: [{
                product_type: "MAIN",
                id: PRODUCT_DATA.id,
                name: PRODUCT_DATA.name,
                price: PRODUCT_DATA.discount_price,
                quantity: qty,
                total_amount: productTotal
            }],

            amount: {
                productTotal,
                deliveryCharge,
                totalAmount: summaryTotal,
            },

            note: document.getElementById("note")?.value.trim() || "",
            otp_required: false,

        };

        try {

            const response = await fetch(
                `${ENV.API_BASE_URL}/site/api/create-order/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (data.success) {

                // =========================
                // FIXED SUCCESS MODAL
                // =========================

                const overlay = document.createElement("div");
                overlay.style.position = "fixed";
                overlay.style.inset = "0";
                overlay.style.background = "rgba(0,0,0,0.6)";
                overlay.style.display = "flex";
                overlay.style.alignItems = "center";
                overlay.style.justifyContent = "center";
                overlay.style.zIndex = "9999";

                const card = document.createElement("div");
                card.style.textAlign = "center";
                card.style.padding = "35px 25px";
                card.style.background = "rgba(255,255,255,0.95)";
                card.style.borderRadius = "22px";
                card.style.boxShadow = "0 15px 40px rgba(0,0,0,0.15)";
                card.style.maxWidth = "420px";
                card.style.width = "90%";
                card.style.backdropFilter = "blur(8px)";

                card.innerHTML = `
                <div style="font-size:50px;">🎉</div>

                <h2>অর্ডার সফল হয়েছে!</h2>

                <p>আমরা আপনার অর্ডার গ্রহণ করেছি।</p>

                <div style="background:#eaffea;padding:10px;border-radius:10px;margin:10px 0;color:#1b7f2a;">
                    ✔ কনফার্ম হয়েছে
                </div>

                <p>Redirect <b><span id="countdown">5</span></b> sec</p>

                <a href="https://wa.me/${ENV.WHATSAPP_NUMBER}"
                style="display:inline-block;margin-top:10px;padding:10px 15px;background:#25D366;color:#fff;border-radius:10px;text-decoration:none;">
                WhatsApp
                </a>
            `;

                overlay.appendChild(card);
                document.body.appendChild(overlay);

                // countdown
                let count = 5;
                const el = card.querySelector("#countdown");

                const interval = setInterval(() => {
                    count--;
                    el.textContent = count;

                    if (count <= 0) {
                        clearInterval(interval);
                        window.location.href = "/";
                    }
                }, 1000);

            } else {
                alert("অর্ডার করতে সমস্যা হয়েছে");
            }

        } catch (err) {
            alert("অর্ডার সাবমিট করতে সমস্যা হয়েছে");
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = "🛒 অর্ডার কনফার্ম করুন";

    });