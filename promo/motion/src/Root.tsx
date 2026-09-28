import { Composition, staticFile, type CalculateMetadataFunction } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Promo, totalFrames } from "./Promo";
import { defaultPromoProps, promoSchema, type PromoProps } from "./schema";
import { FPS } from "./theme";

/** Hold the end card until the voiceover has finished (plus one second). */
const calculateMetadata: CalculateMetadataFunction<PromoProps> = async ({ props }) => {
  const base = totalFrames(props.sceneFrames);
  let extraEndFrames = 0;
  if (props.audio.voiceover) {
    const seconds = await getAudioDurationInSeconds(staticFile(props.audio.voiceover));
    const needed = Math.ceil((props.audio.voiceoverStartSeconds + seconds + 1) * FPS);
    extraEndFrames = Math.max(0, needed - base);
  }
  return { durationInFrames: base + extraEndFrames, props: { ...props, extraEndFrames } };
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="IndiRadioPromo"
    component={Promo}
    schema={promoSchema}
    defaultProps={defaultPromoProps}
    calculateMetadata={calculateMetadata}
    durationInFrames={totalFrames(defaultPromoProps.sceneFrames)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
