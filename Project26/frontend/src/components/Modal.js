import React from 'react';

export default function Modal({ title, children, onClose, onSubmit, submitText = '保存' }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(); }}>
          {children}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>取消</button>
            <button type="submit" className="btn btn-primary">{submitText}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
