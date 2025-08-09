import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Style.css';

function Todo() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Önceden tanımlanmış kategoriler
    const categories = [
        { value: "", label: "Kategori Seçiniz" },
        { value: "İş", label: "İş" },
        { value: "Kişisel", label: "Kişisel" },
        { value: "Alışveriş", label: "Alışveriş" },
        { value: "Sağlık", label: "Sağlık" },
        { value: "Eğitim", label: "Eğitim" },
        { value: "Spor", label: "Spor" },
        { value: "Eğlence", label: "Eğlence" },
        { value: "Diğer", label: "Diğer" }
    ];

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
        if (!title.trim() || !category) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/todos',
                { 
                    title: title.trim(),
                    category: category,
                    description: description.trim()
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setTitle("");
            setCategory("");
            setDescription("");
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

    const getCategoryColor = (category) => {
        const colors = {
            'İş': '#3b82f6',
            'Kişisel': '#10b981',
            'Alışveriş': '#f59e0b',
            'Sağlık': '#ef4444',
            'Eğitim': '#6366f1',
            'Spor': '#06b6d4',
            'Eğlence': '#ec4899',
            'Diğer': '#6b7280'
        };
        return colors[category] || '#6b7280';
    };

    return (
        <div className="todo-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Header */}
                        <div className="header-section">
                            <div className="header-content">
                                <div>
                                    <h2 className="welcome-text">Hoş geldin, {user.userName}!</h2>
                                    <p className="subtitle">Görevlerinizi yönetin</p>
                                </div>
                                <button className="logout-btn" onClick={handleLogout}>
                                    <i className="bi bi-box-arrow-right"></i>
                                    Çıkış
                                </button>
                            </div>
                        </div>

                        {/* Main Card */}
                        <div className="main-card">
                            <div className="card-header">
                                <h4 className="card-title">Görevlerim</h4>
                                <button className="add-btn" onClick={() => setShowModal(true)}>
                                    <i className="bi bi-plus-lg"></i>
                                    Yeni Görev
                                </button>
                            </div>

                            {error && (
                                <div className="error-alert">
                                    <i className="bi bi-exclamation-triangle"></i>
                                    {error}
                                </div>
                            )}

                            {todos.length === 0 ? (
                                <div className="empty-state">
                                    <i className="bi bi-list-check empty-icon"></i>
                                    <p className="empty-text">Henüz görev eklenmemiş</p>
                                    <button className="empty-btn" onClick={() => setShowModal(true)}>
                                        İlk görevinizi ekleyin
                                    </button>
                                </div>
                            ) : (
                                <div className="todo-list">
                                    {todos.map((todo) => (
                                        <div key={todo._id} className="todo-item">
                                            <div className="todo-checkbox">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox"
                                                    checked={todo.completed}
                                                    onChange={() => toggleTodo(todo._id, todo.completed)}
                                                />
                                            </div>
                                            <div className="todo-content">
                                                <div className="todo-title">
                                                    <span className={`title-text ${todo.completed ? 'completed' : ''}`}>
                                                        {todo.title}
                                                    </span>
                                                    {todo.category && (
                                                        <span 
                                                            className="category-badge"
                                                            style={{ backgroundColor: getCategoryColor(todo.category) }}
                                                        >
                                                            {todo.category}
                                                        </span>
                                                    )}
                                                </div>
                                                {todo.description && (
                                                    <div className="todo-description">
                                                        <p className="description-text">{todo.description}</p>
                                                    </div>
                                                )}
                                                <div className="todo-dates">
                                                    <div className="date-item">
                                                        <i className="bi bi-calendar-plus"></i>
                                                        <span className="date-label">Oluşturulma:</span> 
                                                        {new Date(todo.createdAt).toLocaleDateString('tr-TR', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                    {todo.updatedAt !== todo.createdAt && (
                                                        <div className="date-item">
                                                            <i className="bi bi-calendar-check"></i>
                                                            <span className="date-label">Güncellenme:</span> 
                                                            {new Date(todo.updatedAt).toLocaleDateString('tr-TR', {
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
                                            <div className="todo-actions">
                                                <span className={`status-badge ${todo.completed ? 'completed' : 'pending'}`}>
                                                    {todo.completed ? 'Tamamlandı' : 'Bekliyor'}
                                                </span>
                                                <button
                                                    className="delete-btn"
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

            {/* Modal */}
            {showModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <div className="custom-modal-header">
                            <h5 className="custom-modal-title">Yeni Görev Ekle</h5>
                            <button
                                type="button"
                                className="custom-close-btn"
                                onClick={() => {
                                    setShowModal(false);
                                    setTitle("");
                                    setCategory("");
                                    setDescription("");
                                }}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <form onSubmit={addTodo}>
                            <div className="custom-modal-body">
                                <div className="form-group">
                                    <label htmlFor="todoTitle" className="form-label">Görev Başlığı</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        id="todoTitle"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Görev başlığını girin..."
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="todoCategory" className="form-label">Kategori</label>
                                    <select
                                        className="form-select"
                                        id="todoCategory"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="todoDescription" className="form-label">Açıklama (Opsiyonel)</label>
                                    <textarea
                                        className="form-textarea"
                                        id="todoDescription"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="3"
                                        placeholder="Göreviniz hakkında ek bilgi girin..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="custom-modal-footer">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => {
                                        setShowModal(false);
                                        setTitle("");
                                        setCategory("");
                                        setDescription("");
                                    }}
                                >
                                    İptal
                                </button>
                                <button type="submit" className="submit-btn">
                                    <i className="bi bi-plus-lg"></i>
                                    Ekle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Todo; 