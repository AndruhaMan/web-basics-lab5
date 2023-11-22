import './InputField.scss';

export const InputField = ({ currentValue, setValue = () => {}, type = 'text', placeholder = '' }) => {
  return (
    <input
      type={type}
      className="InputField"
      placeholder={placeholder}
      value={currentValue}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}