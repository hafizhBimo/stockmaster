import Table from "@/components/Table/Table";
import { useRouter } from 'next/router';

export default function ListProducts() {
  const router = useRouter();
  const handleClick = () => {
    router.push('/products/form');
  };
  return (
    <div className="listProductWrapper">
      <h1>Product List</h1>
      <div className="buttonWrapper">
      <button onClick={handleClick}>add product</button>
      </div>
      <Table />
    </div>
  );
}
