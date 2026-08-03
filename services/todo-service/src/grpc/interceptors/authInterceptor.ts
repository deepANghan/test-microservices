import grpc, {
    ServerInterceptingCall,
    type ServerInterceptor,
    type ServerListener
} from "@grpc/grpc-js";


export const authInterceptor: ServerInterceptor = (
    methodDefinition,
    call
) => {

    return new ServerInterceptingCall(
        call,
        {
            start(next) {

                next({
                    onReceiveMetadata(metadata, next) {

                        const token = metadata
                            .get("x-user-Id")[0]
                            ?.toString();


                        if (!token) {
                            call.sendStatus({
                                code: grpc.status.UNAUTHENTICATED,
                                details: "Missing authorization token",
                                metadata: new grpc.Metadata()
                            });
                            return;
                        }


                        next(metadata);
                    }
                });

            }
        }
    );
};