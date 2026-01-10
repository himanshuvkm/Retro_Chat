const GenderCheckbox = ({ onChangebox, selectedGender }) => {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
        Gender
      </label>

      <div className="flex gap-3">

        {/* Male */}
        <label className="retro-radio">
          <input
            type="radio"
            name="gender"
            value="male"
            checked={selectedGender === "male"}
            onChange={() => onChangebox("male")}
            required
            className="hidden"
          />
          <span className="retro-radio-dot"></span>
          <span className="retro-radio-label">Male</span>
        </label>

        {/* Female */}
        <label className="retro-radio">
          <input
            type="radio"
            name="gender"
            value="female"
            checked={selectedGender === "female"}
            onChange={() => onChangebox("female")}
            required
            className="hidden"
          />
          <span className="retro-radio-dot"></span>
          <span className="retro-radio-label">Female</span>
        </label>

      </div>
    </div>
  );
};

export default GenderCheckbox;
