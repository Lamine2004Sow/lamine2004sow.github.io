window._dcProjects.push({
  id:    "p1",
  theme: { fr: "VISION · SPATIAL", en: "VISION · SPACE" },
  year:  "2025",
  title: { fr: "Détection d'amers visuels pour navigation autonome", en: "Visual landmark detection for autonomous navigation" },
  blurb: { fr: "Perception relative basée vision pour des opérations de proximité autour d'un petit corps céleste.", en: "Vision-based relative perception for proximity operations around a small celestial body." },
  tags:  ["PyTorch", "OpenCV", "SLAM", "C++"],

  report: {
    kicker:   "TECHNICAL REPORT · CV-2025",
    subtitle: "Vision-based relative navigation for small-body proximity operations",
    metaRole: "Lead — perception",
    metaYear: "2025",
    metaStack: "PyTorch · OpenCV · ROS2",

    abstract: "We present a perception pipeline that detects and tracks surface landmarks from a monocular camera to estimate the relative pose of a spacecraft during proximity operations. A lightweight detector is trained on rendered imagery and adapted to flight-like conditions; detections feed a pose estimator constrained by the multi-view geometry of the observed surface. The system runs in real time on embedded hardware and degrades gracefully under illumination changes.",

    sections: [
      {
        n: "1", heading: "Introduction",
        paras: [
          "Autonomous navigation near a small body cannot rely on a global map. Instead, the spacecraft must build and reuse a local representation of surface features observed across frames. Visual landmarks are attractive because they are passive, low-power and informative about relative motion.",
          "The challenge is robustness: harsh, fast-changing illumination, low texture, and tight compute budgets. We address this with a compact detector and a geometry-constrained estimator.",
        ],
      },
      {
        n: "2", heading: "Method",
        paras: ["Given a calibrated camera with intrinsics K, a landmark with world coordinates X projects to image coordinates x. We minimize the total reprojection error over all tracked landmarks to recover the relative rotation R and translation t:"],
        hasEq: true,
        eq:    "E(R,t)=\\sum_{i=1}^{N}\\left\\lVert \\mathbf{x}_i-\\pi\\!\\left(\\mathbf{K}\\,[\\,\\mathbf{R}\\mid\\mathbf{t}\\,]\\,\\mathbf{X}_i\\right)\\right\\rVert^2",
        eqNum: "(1)",
      },
      {
        n: "3", heading: "Results",
        paras: ["On a held-out sequence the pipeline maintains sub-pixel median reprojection error while running above 20 Hz on the target board. The detector transfers from synthetic to flight-like imagery with limited fine-tuning."],
        hasFig: true, figNote: "rendered scene + detected landmarks", figCaption: "Figure 1 — Detected landmarks (overlay) across a descent sequence.",
        hasTable: true,
        table: {
          head: ["Config", "Reproj. err (px)", "Rate (Hz)"],
          rows: [["Baseline", "1.84", "12"], ["+ geom. constraint", "0.71", "21"], ["+ embedded opt.", "0.74", "27"]],
        },
        tableCaption: "Table 1 — Accuracy / throughput trade-off on the embedded target.",
      },
    ],

    references: [
      { n: "[1]", text: "Hartley & Zisserman. Multiple View Geometry in Computer Vision. Cambridge University Press." },
      { n: "[2]", text: "Mur-Artal et al. ORB-SLAM: a versatile and accurate monocular SLAM system. IEEE T-RO." },
      { n: "[3]", text: "Internal technical note — synthetic-to-real adaptation for surface landmark detection, 2025." },
    ],
  },
});
