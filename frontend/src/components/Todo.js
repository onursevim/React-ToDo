import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Todo() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [title, setTitle] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getList = async () => {
        try {
            const token = localStorage.getItem('token');
            let response = await axios.get('http://localhost:5000/api/todos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTodos(response.data);
            setError("");
        }
        catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Veriler getirilirken bir hata oluştu");
            }
        }
    };

    // Sayfa yüklendiğinde todo'ları getir
    useEffect(() => {
        getList();
    }, []);

    const addTodo = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/todos',
                { title: title.trim() },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setTitle("");
            setShowModal(false);
            getList(); // Listeyi yenile
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Todo eklenirken bir hata oluştu");
            }
        }
    };

    const toggleTodo = async (todoId, completed) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/todos/${todoId}`,
                { completed: !completed },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            getList(); // Listeyi yenile
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Todo güncellenirken bir hata oluştu");
            }
        }
    };

    const deleteTodo = async (todoId) => {
        if (!window.confirm('Bu todo\'yu silmek istediğinizden emin misiniz?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/todos/${todoId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            getList(); // Listeyi yenile
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Todo silinirken bir hata oluştu");
            }
        }
    };
    return (
        <div className="min-vh-100 bg-light">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2 className="text-dark mb-1">Hoş geldin, {user?.userName}!</h2>
                                <p className="text-muted mb-0">Görevlerinizi yönetin</p>
                            </div>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right me-2"></i>
                                Çıkış
                            </button>
                        </div>

                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="text-dark mb-0">Görevlerim</h4>
                                    <button
                                        className="btn btn-primary rounded-pill px-4"
                                        onClick={() => setShowModal(true)}
                                    >
                                        <i className="bi bi-plus-lg me-2"></i>
                                        Yeni Görev
                                    </button>
                                </div>

                                {error && (
                                    <div className="alert alert-danger border-0" role="alert">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        {error}
                                    </div>
                                )}

                                {todos.length === 0 ? (
                                    <div className="text-center py-5">
                                        <i className="bi bi-list-check text-muted" style={{ fontSize: '3rem' }}></i>
                                        <p className="text-muted mt-3 mb-0">Henüz görev eklenmemiş</p>
                                        <button
                                            className="btn btn-outline-primary mt-3"
                                            onClick={() => setShowModal(true)}
                                        >
                                            İlk görevinizi ekleyin
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {todos.map((todo) => (
                                            <div key={todo._id} className="d-flex align-items-center p-3 bg-white rounded-3 border border-light shadow-sm">
                                                <div className="form-check me-3">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        style={{ width: '1.2rem', height: '1.2rem' }}
                                                        checked={todo.completed}
                                                        onChange={() => toggleTodo(todo._id, todo.completed)}
                                                    />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div>
                                                        <span className={`${todo.completed ? 'text-decoration-line-through text-muted' : 'text-dark'} fw-medium`}>
                                                            {todo.title}
                                                        </span>
                                                        <div className="text-muted small mt-1">
                                                            <div className="mb-1">
                                                                <i className="bi bi-calendar-plus me-1"></i>
                                                                <span className="fw-medium">Oluşturulma:</span> {new Date(todo.createdAt).toLocaleDateString('tr-TR', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </div>
                                                            {todo.updatedAt !== todo.createdAt && (
                                                                <div>
                                                                    <i className="bi bi-calendar-check me-1"></i>
                                                                    <span className="fw-medium">Güncellenme:</span> {new Date(todo.updatedAt).toLocaleDateString('tr-TR', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className={`badge rounded-pill ${todo.completed ? 'bg-success' : 'bg-warning'}`}>
                                                        {todo.completed ? 'Tamamlandı' : 'Bekliyor'}
                                                    </span>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger rounded-circle"
                                                        style={{ width: '32px', height: '32px' }}
                                                        onClick={() => deleteTodo(todo._id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">Yeni Görev Ekle</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={addTodo}>
                                <div className="modal-body pt-0">
                                    <div className="mb-4">
                                        <label htmlFor="todoTitle" className="form-label fw-medium">Görev Başlığı</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg border-0 bg-light"
                                            id="todoTitle"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Görev başlığını girin..."
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary px-4"
                                        onClick={() => setShowModal(false)}
                                    >
                                        İptal
                                    </button>
                                    <button type="submit" className="btn btn-primary px-4">
                                        <i className="bi bi-plus-lg me-2"></i>
                                        Ekle
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal backdrop */}
            {showModal && (
                <div className="modal-backdrop fade show"></div>
            )}
        </div>
    );
}

export default Todo; 