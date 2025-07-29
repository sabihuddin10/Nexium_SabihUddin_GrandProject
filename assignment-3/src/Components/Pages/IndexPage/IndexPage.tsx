import PastRecipeWidget from "../../Cards/PastRecipeWidget";
import RecipeGenerator3 from "../../RecipeGenerator/RecipeGenerator3";
import { useUser } from "../../../Context/UserContext";

export default function IndexPage() {
  const { userLoggedIn } = useUser(); // ✅ Hook must be called inside the component

  return (
    <div>
      <RecipeGenerator3 />
      {userLoggedIn && <PastRecipeWidget />}
    </div>
  );
}
