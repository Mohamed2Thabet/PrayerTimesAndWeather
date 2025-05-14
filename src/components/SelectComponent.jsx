/* eslint-disable react/prop-types */
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import "./maincontent.css";
export default function SelectComponent({
  label,
  value,
  onChange,
  options,
  disabled,
}) {
  return (
    <FormControl style={{ width: "50%" }} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={onChange}>
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
