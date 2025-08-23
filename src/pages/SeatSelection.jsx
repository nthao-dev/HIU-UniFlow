import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Room3DScene from './Room3DScene';

const SeatSelection = () => {
    const [step, setStep] = useState(1);
    const [layoutData, setLayoutData] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [viewMode, setViewMode] = useState('2D'); // '2D' hoặc '3D'

    useEffect(() => {
        fetch('/room.json')
            .then((res) => res.json())
            .then((data) => setLayoutData(data))
            .catch((err) => console.error('Không thể tải sơ đồ:', err));
    }, []);

    const handleSelectSeat = (id) => {
        setSelectedSeats((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const handleConfirm = () => {
        alert(`✅ Đặt vé thành công!\n\nHọ tên: ${formData.name}\nEmail: ${formData.email}\nSĐT: ${formData.phone}\nGhế: ${selectedSeats.join(', ')}`);
        setStep(1);
        setSelectedSeats([]);
        setFormData({ name: '', email: '', phone: '' });
    };

    const handleNext = () => {
        if (step === 1 && selectedSeats.length === 0) {
            alert('Vui lòng chọn ít nhất một ghế!');
            return;
        }
        if (step === 2 && (!formData.name || !formData.email || !formData.phone)) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    if (!layoutData) return <div className="p-10 text-center">Đang tải sơ đồ phòng...</div>;

    const { elements, cols, backgroundColor } = layoutData;

    return (
        <div className="relative w-full h-screen flex flex-col">
            {/* Tab chuyển đổi 2D / 3D nhỏ gọn nổi góc trên bên phải */}
            <div className="absolute top-4 right-4 flex space-x-2 z-30 bg-white rounded shadow p-1">
                {['2D', '3D'].map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-3 py-1 rounded font-semibold text-sm cursor-pointer ${viewMode === mode
                            ? 'bg-blue-600 text-white shadow'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        title={`Chuyển sang chế độ ${mode}`}
                    >
                        {mode}
                    </button>
                ))}
            </div>

            {/* Nội dung chính */}
            <div className="flex-1 relative">
                {step === 1 && viewMode === '2D' && (
                    <div
                        className="overflow-auto border p-4 rounded-lg shadow bg-white w-full h-full"
                        style={{ backgroundColor }}
                    >
                        <GridLayout
                            layout={elements.map((el) => ({
                                ...el,
                                w: el.w || 1,
                                h: el.h || 1,
                            }))}
                            cols={cols}
                            rowHeight={60}
                            width={cols * 60}
                            isDraggable={false}
                            isResizable={false}
                            preventCollision
                            compactType={null}
                        >
                            {elements.map((el) => (
                                <div
                                    key={el.i}
                                    onClick={() => el.type === 'chair' && handleSelectSeat(el.i)}
                                    className={`cursor-pointer flex items-center justify-center font-bold relative ${el.type === 'chair' ? 'hover:scale-105 transition-transform' : ''
                                        }`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: selectedSeats.includes(el.i)
                                            ? '#10b981'
                                            : el.color,
                                        borderRadius: el.shape === 'circle' ? '50%' : '0',
                                        transform: el.shape === 'diamond' ? 'rotate(45deg)' : 'none',
                                        color: el.type === 'chair' ? 'white' : 'black',
                                        fontSize: 14,
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            transform: el.shape === 'diamond' ? 'rotate(-45deg)' : 'none',
                                            width: '100%',
                                            textAlign: 'center',
                                            pointerEvents: 'none',
                                        }}
                                    >
                                        {el.label}
                                    </div>
                                </div>
                            ))}
                        </GridLayout>
                    </div>
                )}

                {step === 1 && viewMode === '3D' && (
                    <Room3DScene
                        elements={elements}
                        cols={cols}
                        selectedSeats={selectedSeats}
                        toggleSeat={handleSelectSeat}
                    />
                )}

                {/* Step 2 + 3: Form hoặc xác nhận hiển thị nổi */}
                {(step === 2 || step === 3) && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                            {step === 2 && (
                                <>
                                    <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4 text-center">📝 Nhập thông tin đặt vé</h2>
                                    <label className="block mb-2 font-medium">Họ tên:</label>
                                    <input
                                        type="text"
                                        className="w-full mb-4 p-2 border rounded"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <label className="block mb-2 font-medium">Email:</label>
                                    <input
                                        type="email"
                                        className="w-full mb-4 p-2 border rounded"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <label className="block mb-2 font-medium">Số điện thoại:</label>
                                    <input
                                        type="text"
                                        className="w-full mb-4 p-2 border rounded"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </>
                            )}
                            {step === 3 && (
                                <>
                                    <h2 className="text-xl font-semibold text-green-800 mb-4 text-center">✅ Xác nhận đặt vé</h2>
                                    <p><strong>Họ tên:</strong> {formData.name}</p>
                                    <p><strong>Email:</strong> {formData.email}</p>
                                    <p><strong>SĐT:</strong> {formData.phone}</p>
                                    <p><strong>Ghế đã chọn:</strong> {selectedSeats.join(', ')}</p>
                                </>
                            )}

                            {/* Nút điều hướng */}
                            <div className="flex justify-between mt-6">
                                <button
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                    onClick={handleBack}
                                >
                                    ← Quay lại
                                </button>
                                <button
                                    className={`px-4 py-2 rounded text-white ${step === 2 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                    onClick={step === 2 ? handleNext : handleConfirm}
                                >
                                    {step === 2 ? 'Tiếp tục →' : 'Xác nhận'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nút Tiếp tục nổi khi step 1 */}
                {step === 1 && (
                    <div className="absolute top-1/2 right-6 transform -translate-y-1/2 z-10">
                        <button
                            className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
                            onClick={handleNext}
                        >
                            Tiếp tục đặt vé →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeatSelection;
