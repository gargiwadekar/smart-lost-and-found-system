import { FaShoppingBag, FaIdCard, FaLaptop, FaGlasses, FaHatCowboy } from "react-icons/fa";

const items = [
  { icon: <FaShoppingBag />, label: "Bag" },
  { icon: <FaIdCard />, label: "ID Card" },
  { icon: <FaGlasses />, label: "Glasses" },
  { icon: <FaHatCowboy />, label: "Cap/Hat" },
  { icon: <FaLaptop />, label: "Laptop" }
];

const QuickEntry = () => {
  return (
    <div className="quick-entry">
      <h3>Quick Entry</h3>
      <div className="quick-grid">
        {items.map((item, i) => (
          <div key={i} className="quick-item">
            <span className="icon">{item.icon}</span>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickEntry;
