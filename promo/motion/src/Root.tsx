import { Composition, staticFile, type CalculateMetadataFunction } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Promo, T, totalFrames } from "./Promo";
import { defaultPromoProps, promoSchema, type PromoProps } from "./schema";
import { defaultPromoV2Props, PromoV2 } from "./v2/PromoV2";
import { defaultFilmProps, Film, FILM_DURATION, filmSchema } from "./v3/Film";
import { defaultViralProps, Viral, VIRAL, viralSchema } from "./v4/Viral";
import { defaultHomeProps, Home, homeDuration, homeSchema, type HomeProps } from "./v5/Home";
import { FPS } from "./theme";

/**
 * Reads each voice line's length and stretches its scene so the line fits,
 * with breathing room after it. The end card holds a little longer.
 */
const calculateMetadata: CalculateMetadataFunction<PromoProps> = async ({ props }) => {
  const { voiceLines, voiceLeadFrames } = props.audio;
  const voiceLineSeconds = await Promise.all(voiceLines.map((f) => (f ? getAudioDurationInSeconds(staticFile(f)) : Promise.resolve(0))));
  const resolvedSceneFrames = props.sceneFrames.map((min, i) => {
    if (!voiceLineSeconds[i]) return min;
    const lead = (i === 0 ? 0 : T) + voiceLeadFrames;
    const tail = i === voiceLines.length - 1 ? 45 : 14; // pause after the line
    return Math.max(min, lead + Math.ceil(voiceLineSeconds[i] * FPS) + tail + (i === voiceLines.length - 1 ? 0 : T));
  });
  return { durationInFrames: totalFrames(resolvedSceneFrames), props: { ...props, resolvedSceneFrames, voiceLineSeconds } };
};

export const RemotionRoot: React.FC = () => (
  <>
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
  <Composition
    id="IndiRadioPromoV2"
    component={PromoV2}
    schema={promoSchema}
    defaultProps={defaultPromoV2Props}
    calculateMetadata={calculateMetadata}
    durationInFrames={totalFrames(defaultPromoV2Props.sceneFrames)}
    fps={FPS}
    width={1080}
    height={1920}
  />
  <Composition
    id="IndiRadioBrandFilm"
    component={Film}
    schema={filmSchema}
    defaultProps={defaultFilmProps}
    durationInFrames={FILM_DURATION}
    fps={FPS}
    width={1080}
    height={1920}
  />
  <Composition
    id="IndiRadioViral"
    component={Viral}
    schema={viralSchema}
    defaultProps={defaultViralProps}
    durationInFrames={VIRAL.total}
    fps={FPS}
    width={1080}
    height={1920}
  />
  <Composition
    id="IndiRadioHome"
    component={Home}
    schema={homeSchema}
    defaultProps={defaultHomeProps}
    durationInFrames={homeDuration(defaultHomeProps)}
    calculateMetadata={({ props }: { props: HomeProps }) => ({ durationInFrames: homeDuration(props) })}
    fps={FPS}
    width={1080}
    height={1920}
  />
  </>
);
