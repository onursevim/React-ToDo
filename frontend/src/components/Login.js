import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './Style.css';

function Login() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const login = async (e) => {
        e.preventDefault();
        setError(""); // Hata mesajını temizle
        try {
            let model = { userName: userName, password: password };
            let response = await axios.post("http://localhost:5000/api/login", model);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate("/todo");
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Giriş yapılırken bir hata oluştu");
            }
        }
    }

    return (
        <div className="auth-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        {/* Header Section */}
                        <div className="auth-header">
                            <div className="text-center">
                                <h1 className="auth-title">Hoş Geldiniz</h1>
                                <p className="auth-subtitle">Hesabınıza giriş yapın</p>
                            </div>
                        </div>

                        {/* Main Card */}
                        <div className="auth-card">
                            <div className="auth-card-body">
                                <form onSubmit={login}>
                                    <div className="form-group">
                                        <label htmlFor="userName" className="form-label">Kullanıcı Adı</label>
                                        <input
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            type="text"
                                            id="userName"
                                            name="userName"
                                            className="form-input"
                                            placeholder="Kullanıcı adınızı girin"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password" className="form-label">Şifre</label>
                                        <input
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            type="password"
                                            id="password"
                                            name="password"
                                            className="form-input"
                                            placeholder="Şifrenizi girin"
                                            required
                                        />
                                    </div>
                                    {error && (
                                        <div className="error-alert">
                                            <i className="bi bi-exclamation-triangle"></i>
                                            {error}
                                        </div>
                                    )}
                                    <button className="auth-submit-btn">
                                        <i className="bi bi-box-arrow-in-right"></i>
                                        Giriş Yap
                                    </button>
                                    <div className="auth-link-section">
                                        <Link to="/register" className="auth-link">
                                            Hesabınız yok mu? <span className="auth-link-highlight">Kayıt olun</span>
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;