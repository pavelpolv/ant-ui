import { Button as AntButton, type ButtonProps as AntButtonProps } from 'antd';
import styles from './Button.module.scss';

export type ButtonProps = AntButtonProps;

export const Button = ({ className, ...props }: ButtonProps) => (
  <AntButton className={[styles.root, className].filter(Boolean).join(' ')} {...props} />
);
