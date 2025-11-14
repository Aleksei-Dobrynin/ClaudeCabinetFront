import React from 'react';
import { TextField, InputAdornment } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

type TextFieldProps = {
  value: string | number;
  label: string;
  name: string;
  onChange: (e) => void;
  id: string;
  error?: boolean,
  helperText?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  InputProps?: any;
  icon?: any;
  onKeyDown?: (e) => void;
  onBlur?: (e) => void;
  onFocus?: (e) => void;
  noFullWidth?: boolean;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  focused?: boolean;
  sx?: SxProps<Theme>;
}


const CustomTextField = (props: TextFieldProps) => {

  var elem = props.icon ? React.cloneElement(
    props.icon,
    { color: "primary" }
  ) : null
  var icon = elem ? <InputAdornment position="start" style={{ color: 'Gray' }}>
    {props.icon}
  </InputAdornment> : null

  return (
    <TextField
      {...props}
      value={props.type === "number" && props.value == null ? "" : props.value ?? ""}
      variant="outlined"
      fullWidth={!props.noFullWidth}
      onKeyDown={props.onKeyDown}
      data-testid={props.id}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      onWheel={(event: any) => {
        event?.currentTarget?.blur();
        event?.target?.blur();
      }}
      rows={props.rows}
      size='small'
      color={props.color ?? "primary"}
      focused={props.focused ?? false}
      error={props.error}
      helperText={props.helperText}
      InputProps={{
        ...props.InputProps,
        startAdornment: (icon),
      }}
      multiline={props.multiline}
      sx={props.sx}
    />
  );
}

export default CustomTextField;
