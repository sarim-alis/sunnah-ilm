const { withAppBuildGradle } = require('expo/config-plugins');

const RELEASE_SIGNING = `        // sunnah-ilm-release-signing
        release {
            def keystorePropertiesFile = rootProject.file("../native-resources/keystore.properties")
            if (keystorePropertiesFile.exists()) {
                def keystoreProperties = new Properties()
                keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile rootProject.file("../native-resources/" + keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }`;

function applyReleaseSigning(contents) {
  if (!contents.includes('sunnah-ilm-release-signing')) {
    const withReleaseConfig = contents.replace(
      /(signingConfigs\s*\{[\s\S]*?debug\s*\{[\s\S]*?\n\s*\})/,
      `$1\n${RELEASE_SIGNING}`,
    );

    if (withReleaseConfig === contents) {
      throw new Error(
        'withAndroidReleaseSigning: could not find signingConfigs.debug in android/app/build.gradle',
      );
    }

    contents = withReleaseConfig;
  }

  const withReleaseBuildType = contents.replace(
    /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.debug/,
    '$1signingConfig signingConfigs.release',
  );

  if (withReleaseBuildType === contents && !contents.includes('signingConfig signingConfigs.release')) {
    throw new Error(
      'withAndroidReleaseSigning: could not switch release builds to signingConfigs.release',
    );
  }

  return withReleaseBuildType;
}

function withAndroidReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') {
      throw new Error('withAndroidReleaseSigning: expected groovy android/app/build.gradle');
    }

    config.modResults.contents = applyReleaseSigning(config.modResults.contents);
    return config;
  });
}

module.exports = withAndroidReleaseSigning;
