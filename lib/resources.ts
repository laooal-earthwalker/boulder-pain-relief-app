import type { BodyPart, Condition, ResourceItem } from "@/components/resources/ResourceLibrary";

export type { BodyPart, Condition, ResourceItem };

export const BODY_PART_LABELS: Record<BodyPart, string> = {
  neck: "Neck",
  shoulders: "Shoulders",
  "upper-back": "Upper Back",
  "lower-back": "Lower Back",
  hips: "Hips",
  knees: "Knees",
  feet: "Feet",
};

export const CONDITION_LABELS: Record<Condition, string> = {
  "desk-worker": "Desk Worker",
  athlete: "Athlete",
  crossfit: "CrossFit",
  "post-session": "Post-Session Care",
  general: "General Wellness",
};

export const resources: ResourceItem[] = [
  {
    id: "1",
    slug: "forward-head-posture-release",
    title: "Forward Head Posture: Daily Release Routine",
    bodyPart: "neck",
    condition: "desk-worker",
    description:
      "For every inch your head sits forward of your shoulders, the effective load on your cervical spine increases by roughly 10 lbs. This routine targets the suboccipitals, scalenes, and upper traps to undo the pattern that builds up over a workday.",
  },
  {
    id: "2",
    slug: "cervical-mobility-overhead-athletes",
    title: "Cervical Mobility for Overhead Athletes",
    bodyPart: "neck",
    condition: "athlete",
    description:
      "Restricted neck rotation and lateral flexion directly limits shoulder overhead range. This protocol uses segmental mobilization and contract-relax techniques to restore cervical motion that feeds into pressing and pulling mechanics.",
  },
  {
    id: "3",
    slug: "pec-minor-release-rounded-shoulders",
    title: "Pec Minor Self-Release for Rounded Shoulders",
    bodyPart: "shoulders",
    condition: "desk-worker",
    description:
      "Shortened pec minor tilts the scapula anteriorly, compresses the brachial plexus, and limits shoulder flexion. A lacrosse ball and two targeted stretches done daily can meaningfully shift this pattern within two weeks.",
  },
  {
    id: "4",
    slug: "shoulder-mobility-overhead-squat",
    title: "Shoulder Mobility for the Overhead Squat and Snatch",
    bodyPart: "shoulders",
    condition: "crossfit",
    description:
      "Stacked limitations in thoracic extension, shoulder external rotation, and wrist dorsiflexion all converge in the overhead position. This guide breaks the problem into three addressable pieces and gives you a daily prep sequence.",
  },
  {
    id: "5",
    slug: "thoracic-extension-foam-roller",
    title: "Thoracic Spine Extension Over a Foam Roller",
    bodyPart: "upper-back",
    condition: "desk-worker",
    description:
      "Thoracic kyphosis from prolonged sitting locks the mid-back into flexion and drives compensation up into the neck and down into the lower back. Segmental thoracic extension over a foam roller is one of the highest-yield self-care moves for desk workers.",
  },
  {
    id: "6",
    slug: "upper-back-breathing-reset",
    title: "Upper Back Breathing Reset",
    bodyPart: "upper-back",
    condition: "general",
    description:
      "Shallow chest breathing overloads the scalenes, SCM, and upper traps as accessory muscles — a common driver of upper back tension that has nothing to do with posture. This 5-minute reset uses diaphragmatic breathing to downregulate the system.",
  },
  {
    id: "7",
    slug: "hip-flexor-lengthening-lower-back",
    title: "Hip Flexor Lengthening for Lower Back Pain",
    bodyPart: "lower-back",
    condition: "desk-worker",
    description:
      "Short hip flexors from prolonged sitting anteriorly tilt the pelvis, increase lumbar lordosis, and compress the facet joints. The couch stretch and a 90/90 hip flexor stretch done 2x daily targets psoas and rectus femoris directly.",
  },
  {
    id: "8",
    slug: "ql-self-massage-lower-back",
    title: "QL Self-Massage for Training-Related Lower Back Tightness",
    bodyPart: "lower-back",
    condition: "athlete",
    description:
      "The quadratus lumborum is one of the most commonly overlooked drivers of low back pain in athletes. This guide covers how to locate it with a lacrosse ball, differentiate QL tightness from disc or SI joint issues, and when to back off.",
  },
  {
    id: "9",
    slug: "lower-back-post-session-care",
    title: "Lower Back Care After a Deep Tissue Session",
    bodyPart: "lower-back",
    condition: "post-session",
    description:
      "After significant work on the lumbar erectors and QL, some clients experience a 24–48 hour soreness window. This guide covers what's normal, what heat vs. ice is appropriate for, and which movements to avoid while the tissue settles.",
  },
  {
    id: "10",
    slug: "hip-capsule-mobility-squat",
    title: "Hip Capsule Mobility for the Deep Squat",
    bodyPart: "hips",
    condition: "crossfit",
    description:
      "Most squat depth limitations aren't hamstring flexibility issues — they're hip capsule restrictions in IR and ER. This protocol uses banded distractions and contract-relax techniques to create lasting change in the hip joint itself.",
  },
  {
    id: "11",
    slug: "it-band-tfll-runners-knee",
    title: "IT Band and TFL Work for Lateral Knee Pain",
    bodyPart: "knees",
    condition: "athlete",
    description:
      "IT band syndrome is a compression issue, not just tightness — rolling directly on the band often makes it worse. This guide explains the actual mechanism and directs self-care to the TFL, glute med, and distal attachment where it makes a difference.",
  },
  {
    id: "12",
    slug: "plantar-fascia-morning-routine",
    title: "Plantar Fascia Morning Routine",
    bodyPart: "feet",
    condition: "general",
    description:
      "The first steps in the morning are the worst because the plantar fascia shortens overnight. Two minutes of targeted tissue work and calf loading before you stand up can dramatically reduce morning symptoms and slow the cycle of re-injury.",
  },
  {
    id: "13",
    slug: "piriformis-release-post-session",
    title: "Piriformis and Glute Release After Lower Body Work",
    bodyPart: "hips",
    condition: "post-session",
    description:
      "After glute and hip work in a session, targeted mobility helps the tissue adapt rather than re-brace. This short routine uses a figure-four stretch and a supine hip IR mobilization to extend the effects of your treatment.",
  },
  {
    id: "14",
    slug: "rotator-cuff-activation-post-session",
    title: "Rotator Cuff Activation After Upper Body Massage",
    bodyPart: "shoulders",
    condition: "post-session",
    description:
      "Releasing the dominant muscles around the shoulder (pec, lat, upper trap) without reinforcing the rotator cuff leaves a motor control gap. These three activation exercises should follow any upper body session to help the nervous system re-pattern.",
  },
];
