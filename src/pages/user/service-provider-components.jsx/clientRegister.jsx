import React from 'react';


export function ClientRegister() {
  const handleRegister = (e) => {
    e.preventDefault();
    const modal = new window.bootstrap.Modal(document.getElementById('staticBackdrop2'));
    modal.show();
  };

  return (
    <div className="grid place-content-center bg-gray-900">
      <div className="py-5 my-5 text-center text-white mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Talk to Pro</h1>
        <h4 className="text-xl mb-4">
          If you are a professional, earn money with your free time
        </h4>
        <p className="text-sm mb-4">
          If you are a professional in any field, you have the opportunity to earn money by renting your free time. Build your personal brand through that.
        </p>
        <hr className="border-t border-gray-700 my-4" />
        <button onClick={handleRegister} className="btn btn-outline-light border border-white text-white py-2 px-4 rounded-md hover:bg-white hover:text-gray-900">
          Register Now
        </button>
      </div>

      
    </div>
  );
}
