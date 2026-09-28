import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { T, Timeline } from "../Promo";
import { defaultPromoProps, type PromoProps } from "../schema";
import { diamondWipe } from "./fx";
import { AdvertiseV2, CarouselV2, EndV2, GlobeV2, HookV2, LogoV2, VisualizerV2 } from "./scenes";

/** V2 scenes need a little more room for their motion than V1. */
export const defaultPromoV2Props: PromoProps = {
  ...defaultPromoProps,
  sceneFrames: [100, 80, 200, 150, 200, 200, 170],
  resolvedSceneFrames: [100, 80, 200, 150, 200, 200, 170],
  listenTapFrame: 46,
};

const TRANSITIONS = [
  diamondWipe(),
  slide({ direction: "from-bottom" }),
  diamondWipe(),
  wipe({ direction: "from-right" }),
  diamondWipe(),
  slide({ direction: "from-right" }),
];

export const PromoV2: React.FC<PromoProps> = (props) => (
  <Timeline
    props={props}
    transitions={TRANSITIONS}
    scenes={[
      <HookV2 key="hook" p={props.hook} />,
      <LogoV2 key="logo" p={props.logo} />,
      <CarouselV2 key="home" p={props.home} />,
      <VisualizerV2 key="listen" p={props.listen} tapAt={props.listenTapFrame} voice={props.audio.voiceLines[3]} voiceFrom={T + props.audio.voiceLeadFrames} />,
      <GlobeV2 key="clocks" p={props.clocks} />,
      <AdvertiseV2 key="advertise" p={props.advertise} />,
      <EndV2 key="end" p={props.end} />,
    ]}
  />
);
