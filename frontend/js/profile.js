// Simulating fetching profile data from backend
document.addEventListener("DOMContentLoaded", () => {
    const userProfile = {
        name: "John Doe",
        age: 28,
        email: "johndoe@example.com",
        mobile: "9876543210",
        address: "123 Street, City",
        aadharCardNumber: "123456789012",
        role: "voter",
        isVoted: false
    };

    document.getElementById("name").innerText = userProfile.name;
    document.getElementById("age").innerText = userProfile.age;
    document.getElementById("email").innerText = userProfile.email;
    document.getElementById("mobile").innerText = userProfile.mobile;
    document.getElementById("address").innerText = userProfile.address;
    document.getElementById("aadhar").innerText = userProfile.aadharCardNumber;
    document.getElementById("role").innerText = userProfile.role;
    document.getElementById("isVoted").innerText = userProfile.isVoted ? "Yes" : "No";
});
