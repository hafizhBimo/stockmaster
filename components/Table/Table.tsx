import Button from "../Button/Button";
import styles from "./Table.module.css";

const Table = () => {
  return (
    <div>
      <table className={styles.tableWrapper}>
        <thead>
          <tr>
            <th>Picture</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Supplier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>foto</td>
            <td>Maria Anders</td>
            <td>Germany</td>
            <td>foto</td>
            <td>Maria Anders</td>
            <td>Germany</td>
            <td>
              <Button type="edit"/>
              <Button type="delete"/>
            </td>
          </tr>
          <tr>
            <td>foto</td>
            <td>Maria Anders</td>
            <td>Germany</td>
            <td>foto</td>
            <td>Maria Anders</td>
            <td>Germany</td>
            <td>
              <Button type="edit"/>
              <Button type="delete"/>
            </td>
          </tr>
          <tr>
            <td>foto</td>
            <td>Maria Anders</td>
            <td>Germany</td>
            <td>foto</td>
            <td>Maria Anders</td>
            <td>Germany</td>
            <td>
              <Button type="edit"/>
              <Button type="delete"/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
