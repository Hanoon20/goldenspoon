export const INTRO_SEEN_KEY = "gs_intro_seen";

/** Runs before first paint so returning visitors (same tab) and reduced-motion users never see the intro flash. */
export const INTRO_GUARD_SCRIPT = `try{if(sessionStorage.getItem("${INTRO_SEEN_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen")}catch(e){}`;
