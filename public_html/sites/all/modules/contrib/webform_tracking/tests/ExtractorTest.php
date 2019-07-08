<?php

namespace Drupal\webform_tracking;

/**
 * Test the extractor class.
 */
class ExtractorTest extends \DrupalUnitTestCase {

  /**
   * Test that we get sensible data for empty inputs.
   */
  public function testEmptySubmission() {
    $extractor = new Extractor([], []);
    $submission = (object) ['nid' => 1, 'sid' => 1];
    $extractor->addTrackingData($submission);
    $this->assertNotEmpty($submission->tracking);
  }

  /**
   * Test that anonymised $submission->remote_addr is ignored.
   */
  public function testAnonymisedRemoteAddr() {
    $ip_address = &drupal_static('ip_address');
    $ip_address = '1.1.1.1';
    $extractor = $this->getMockBuilder(Extractor::class)
       ->setMethods(['getCountry' ])
       ->setConstructorArgs([[], []])
       ->getMock();
    $extractor->expects($this->once())
      ->method('getCountry')
      ->with($this->equalTo('1.1.1.1'));
    $submission = (object) [
      'nid' => 1,
      'sid' => 1,
      'remote_addr' => '(unknown)',
    ];
    $extractor->addTrackingData($submission);
  }

}
