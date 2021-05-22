import { FailureReason } from "../src/common";
import {
  getError,
  InternalProcessingError,
  NotAllowedError,
  NotAllowedTargetEnvironmentError,
  ResourceAlreadyExistError,
  ResourceNotFoundError,
  ServiceUnavailableError,
  UnspecifiedError
} from "../src/errors";
import { expect } from "./chai";

describe("Errors", function() {
  describe("getError", function() {
    context("when there is no error code", function() {
      it("returns unspecified error", function() {
        expect(getError()).is.instanceOf(UnspecifiedError);
      });
    });

    context("when there is an error code", function() {
      it("returns the correct error", function() {
        expect(
          getError(FailureReason.INTERNAL_PROCESSING_ERROR, "test message")
        )
          .is.instanceOf(InternalProcessingError)
          .and.has.property("message", "test message");

        expect(getError(FailureReason.NOT_ALLOWED, "test message"))
          .is.instanceOf(NotAllowedError)
          .and.has.property("message", "test message");

        expect(
          getError(FailureReason.NOT_ALLOWED_TARGET_ENVIRONMENT, "test message")
        )
          .is.instanceOf(NotAllowedTargetEnvironmentError)
          .and.has.property("message", "test message");

        expect(getError(FailureReason.RESOURCE_ALREADY_EXIST, "test message"))
          .is.instanceOf(ResourceAlreadyExistError)
          .and.has.property("message", "test message");

        expect(getError(FailureReason.RESOURCE_NOT_FOUND, "test message"))
          .is.instanceOf(ResourceNotFoundError)
          .and.has.property("message", "test message");

        expect(getError(FailureReason.SERVICE_UNAVAILABLE, "test message"))
          .is.instanceOf(ServiceUnavailableError)
          .and.has.property("message", "test message");
      });
    });
  });
});
