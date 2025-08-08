import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Register() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const register = async (e) => {
        e.preventDefault();
        setError(""); // Hata mesajını temizle
        try {
            let model = { userName: userName, password: password };
            let response = await axios.post("http://localhost:5000/api/register", model);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate("/todo");
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Kayıt olurken bir hata oluştu");
            }
        }
    }

    return (
        <div className="min-vh-100 bg-light d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="text-center mb-5">
                            <h1 className="text-dark fw-bold mb-2">Hesap Oluşturun</h1>
                            <p className="text-muted">Yeni hesabınızı oluşturun</p>
                        </div>
                        
                        <div className="card border-0 shadow-lg">
                            <div className="card-body p-5">
                                <form onSubmit={register}>
                                    <div className="mb-4">
                                        <label htmlFor="userName" className="form-label fw-medium">Kullanıcı Adı</label>
                                        <input 
                                            value={userName}
                                            onChange={(e)=>setUserName(e.target.value)}
                                            type="text" 
                                            id="userName" 
                                            name="userName" 
                                            className="form-control form-control-lg border-0 bg-light" 
                                            placeholder="Kullanıcı adınızı girin"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label fw-medium">Şifre</label>
                                        <input 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            type="password" 
                                            id="password" 
                                            name="password" 
                                            className="form-control form-control-lg border-0 bg-light" 
                                            placeholder="Şifrenizi girin"
                                            required
                                        />
                                    </div>
                                    {error && (
                                        <div className="alert alert-danger border-0 mb-4" role="alert">
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            {error}
                                        </div>
                                    )}
                                    <button className="btn btn-success btn-lg w-100 mb-4">
                                        <i className="bi bi-person-plus me-2"></i>
                                        Kayıt Ol
                                    </button>
                                    <div className="text-center">
                                        <Link to="/login" className="text-decoration-none">
                                            Zaten hesabınız var mı? <span className="text-primary fw-medium">Giriş yapın</span>
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

export default Register;