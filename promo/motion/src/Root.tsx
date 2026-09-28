import { Composition } from "remotion";
import { Promo, PROMO_DURATION } from "./Promo";
import { FPS } from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition id="IndiRadioPromo" component={Promo} durationInFrames={PROMO_DURATION} fps={FPS} width={1080} height={1920} />
);
