import React from 'react';

const FormInput = ({ id, label, type = 'text', value, onChange, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="w-full px-4 py-2 border rounded-lg text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={onChange}
        {...props}
        required
      />
    </div>
  );
};

export default FormInput;