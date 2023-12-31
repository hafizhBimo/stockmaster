import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";

import styles from "./Button.module.css"


type buttonType = {
  type: string;
  onClick?: () => void;
};

const Button = ({ type, onClick }: buttonType) => {
  return <button className={styles.buttonWrapper} onClick={onClick}>{type === "edit" ? <FaRegEdit size={20} style={{color:"#0834d1"}}/> : <FaRegTrashAlt size={20} style={{color:"#b50202"}} />}</button>;
};

export default Button;
